const UpsellService = (function () {

  

    let upsellOptionItems;

    /**
     * Fetch Order Details for Upsell page
    */
    const getOrder = async () => {
        console.log("get order");
        try {
            const response = await fetch((ordersURL + refId + '/'), {
                method: 'GET',
                headers,
            });
            const result = await response.json();

            if (!response.ok) {
                console.log('Something went wrong');
                return;
            }

            // FIXME: mote out of method into its caller
            if (result.supports_post_purchase_upsells === false) {
                window.location.href = campaign.skipSteps(confirmationURL);
            }

            console.log(result);

        } catch (error) {
            console.log(error);
        }
    };

    // const retrieveOrder = Utils.once(getOrder);

    /**
     * Fetch Upsell Items
    */
    const upsells = async () => {
        console.log("get upsell items");

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': publicKey
        };

        let items;

        try {
            const response = await fetch(campaignRetrieveURL, {
                method: 'GET',
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                return;
            }

            items = data.packages.reduce((accumulator, item) => {
                if (config.campaignUpsellsIds.includes(item.external_id)) {
                    accumulator.push(item);
                }
                return accumulator;
            }, []);

            if (!response.ok) {
                console.log('Something went wrong');
                return;
            }

        } catch (error) {
            console.log(error);
        }

        return items;
    };

    const upsellLineItemObjs = (upsells) => {

        return upsells.map((item) => {
            return upsellLineItemObj(item)
        })
    }

    const upsellLineItemObj = (upsell) => {

        return {
            "package_id": upsell.ref_id,
            "quantity": upsell.qty
        }
    }

    /**
     * Process Upsell Order
    */
    const createUpsell = async (data) => {
        console.log("create upsell", data);
        
        const btnUpsell = document.querySelector('.btn-success');

        const orderData = {
            "lines": [{
                "package_id": data.dataset.ref_id,
                "quantity": data.dataset.qty
            }]
        };

        btnUpsell.disabled = true;
        btnUpsell.textContent = btnUpsell.dataset.loadingText;

        try {
            const response = await fetch((ordersURL + refId + '/upsells/'), {
                method: 'POST',
                headers,
                body: JSON.stringify(orderData),
            });
            const result = await response.json();

            if (!response.ok) {
                console.log('Something went wrong');
                btnUpsell.disabled = false;
                btnUpsell.textContent = btnUpsell.dataset.text;
                return;
            }

            console.log(result);
            location.href = campaign.nextStep(nextURL);

        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Initialize the upsell manager
    */
    const init = () => {

        document.addEventListener("DOMContentLoaded", function (event) {

            // Retrieve the order details
            // retrieveOrder();
            Utils.once(getOrder);

            // Fetch the upsell items and render them
            upsells().then(data => {
                
                if (data && data.length > 0) {
                    UpsellItem.render(data);
                }
                upsellOptionItems = upsellLineItemObjs(data);
               


                const container = document.querySelector(".up-box");

                const noUpsellBtn = document.createElement('div');
                noUpsellBtn.className = 'upsell-no-wrap row justify-content-center py-3';
                noUpsellBtn.innerHTML = `
                    <div class="col py-2">
                            <a href="#" class="d-flex justify-content-center align-items-center text-secondary upsell-no"> 
                            No thank you, I don’t want to take advantage of this one-time offer 
                            </a>
                    </div>`;
            
                container.appendChild(noUpsellBtn);
    
                // Add event listeners to upsell-no buttons
                [...document.getElementsByClassName('upsell-no')].forEach(anchor => {
                    anchor.href = campaign.nextStep(nextURL);
                });


                // Listen for event 'upsellSelected'
                document.addEventListener('upsellSelected', function (event) {
                    const dataset = event.detail;  // Get the upsell data from the event
                    Utils.once(createUpsell(dataset));
                
                });

                
            });
           
        });
    };

    return {
        init,
        upsellLineItemObj
    };

})();

UpsellService.init();