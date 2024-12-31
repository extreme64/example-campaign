const UpsellService = (function () {

    const btnUpsell = document.querySelector('.btn-success');

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

            if (result.supports_post_purchase_upsells === false) {
                window.location.href = campaign.skipSteps(confirmationURL);
            }

            console.log(result);

        } catch (error) {
            console.log(error);
        }
    };

    const retrieveOrder = campaign.once(getOrder);

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

            //TODO: extract external_id [] in ome setup/config
            items = data.packages.reduce((accumulator, item) => {
                if (item.external_id === 3 || item.external_id === 4) {
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

        console.log('ups', items);
        return items;
    };

    const upsellLineItemObj = (upsells) => {

        return upsells.map((item) => {
            return {
                "package_id": item.ref_id,
                "quantity": item.qty
            }
        })
    }

    /**
     * Process Upsell Order
    */
    const createUpsell = async () => {
        console.log("create upsell");
        //TODO: upsellOptionItems to be fored via selecting UPSELLs in UI
        const orderData = {
            "lines": upsellOptionItems
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
            retrieveOrder();

            // Fetch the upsell items and render them
            upsells().then(data => {
                if (data && data.length > 0) {
                    UpsellItem.render(data);
                }
                upsellOptionItems = upsellLineItemObj(data);
                console.log(upsellOptionItems);
                
            });

            // Attach event listener for the upsell button
            const sendUpsell = campaign.once(createUpsell);

            const clickHandler = () => {
                sendUpsell();
            };

            btnUpsell.addEventListener('click', clickHandler);

            // Add event listeners to upsell-no buttons
            [...document.getElementsByClassName('upsell-no')].forEach(anchor => {
                anchor.href = campaign.nextStep(nextURL);
            });
        });
    };

    return {
        init
    };

})();

UpsellService.init();