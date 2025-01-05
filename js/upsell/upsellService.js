
const UpsellService = (function () {

    let upsellOptionItems;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': config.publicKey
    }

    /**
     * Fetch Order Details for Upsell page
    */
    const getOrder = async () => {
        console.log("get order");
        try {
            const response = await fetch((config.ordersURL + refId + '/'), {
                method: 'GET',
                headers,
            });
            const result = await response.json();

            if (!response.ok) {
                console.log('Something went wrong');
                return;
            }

            console.log(result);

            return result;
            const UpsellItem = require("./upsellItem");
        } catch (error) {
            console.log(error);
        }
    };


    /**
     * Fetch Upsell Items
    */
    const upsells = async () => {
        console.log("get upsell items");

        let items;

        try {
            const response = await fetch(Campaign.campaignRetrieveURL, {
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

        const orderData = {
            "lines": [{
                "package_id": data.dataset.refId,
                "quantity": data.dataset.qty
            }]
        };

        try {
            const response = await fetch((config.ordersURL + refId + '/upsells/'), {
                method: 'POST',
                headers,
                body: JSON.stringify(orderData),
            });
            const result = await response.json();

            if (!response.ok) {
                console.log('Something went wrong');
                const btnUpsells = document.querySelectorAll(UpsellItem.successButtonSelector);
                btnUpsells.forEach(btn => {
                    if (btn.dataset.refId == data.dataset.refId) {
                        btn.disabled = false;
                        btn.textContent = btn.dataset.loadingText;
                    }
                });

                return;
            }

            console.log(result);
            location.href = Campaign.nextStep(nextURL);

        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Initialize the upsell manager
    */
    const init = () => {

        document.addEventListener("DOMContentLoaded", function (event) {
            
            const orderResult = Utils.once(getOrder);
            
            if (orderResult.supports_post_purchase_upsells === false) {
                window.location.href = Campaign.skipSteps(confirmationURL);
            }
            
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
                    anchor.href = Campaign.nextStep(nextURL);
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
        createUpsell,
        upsellLineItemObj
    };

})();

UpsellService.init();
