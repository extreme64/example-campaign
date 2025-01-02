// 
// Variables
// 
const campaignRetrieveURL = 'https://campaigns.apps.29next.com/api/v1/campaigns/';
const cartsCreateURL = 'https://campaigns.apps.29next.com/api/v1/carts/'
const ordersURL = 'https://campaigns.apps.29next.com/api/v1/orders/'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': publicKey
}

const confirmationURL = "/thank-you.html";

//
// Methods
// 
const campaign = (() => {

    /**
     *  Get Campaign
     */
    const getCampaign = async () => {
        
        try {
            const response = await fetch(campaignRetrieveURL, {
                method: 'GET',
                headers,
            });

            const data = await response.json()

            if (!response.ok) {
                return;
            }


            offers = data;

            getCampaignData(data);

            Packages.renderPackages();

           
            const offersNew = offersParentEl[0].querySelectorAll('.offer');

            if (offersNew !== undefined) {

                offersNew.forEach((offer, index) => {

                    const pName = data.packages[index].name;
                    offer.dataset.name = pName;

                    const pPriceEach = data.packages[index].price;
                    offer.dataset.priceEach = pPriceEach;

                    const pPriceShipping = data.shipping_methods[0].price;
                    offer.dataset.priceShipping = pPriceShipping;


                    offer.dataset.priceTotal = data.packages[index].price_total;

                    const shippingMethod = data.shipping_methods[0].ref_id;
                    offer.dataset.shippingMethod = shippingMethod;

                    offer.dataset.quantity = data.packages[index].qty;



                    document.getElementById('shipping_method').value = shippingMethod;
                    document.querySelector('.selected-product-name').textContent = pName;

                    document.querySelector('.selected-product-price').textContent = campaign.currency.format(pPriceEach);

                    summaryShipPrice.text = pPriceShipping == 0.00 ? "FREE" : campaign.currency.format(pPriceShipping);

                    offer.addEventListener('click', (event) => {

                        // reset other
                        const selectedItems = offersParentEl[0].querySelectorAll('.selected');
                        selectedItems.forEach(item => {
                            item.classList.remove('selected');
                        });

                        // TODO: set value//class

                        offer.classList.add('selected');


                        // let pid = offer.dataset.packageId;
                        offer.dataset.packageId = data.packages[index].ref_id;


                        const pName = data.packages[index].name;
                        offer.dataset.name = pName;

                        const pPriceEach = data.packages[index].price;
                        offer.dataset.priceEach = pPriceEach;

                        const pPriceShipping = data.shipping_methods[0].price;
                        offer.dataset.priceShipping = pPriceShipping;


                        offer.dataset.priceTotal = data.packages[index].price_total;

                        const shippingMethod = data.shipping_methods[0].ref_id;
                        offer.dataset.shippingMethod = shippingMethod;

                        offer.dataset.quantity = data.packages[index].qty;



                        document.getElementById('shipping_method').value = shippingMethod;
                        document.querySelector('.selected-product-name').textContent = pName;

                        document.querySelector('.selected-product-price').textContent = campaign.currency.format(pPriceEach);

                        summaryShipPrice.text = pPriceShipping == 0.00 ? "FREE" : campaign.currency.format(pPriceShipping);

                        Cart.calculateTotal()

                    });
                });
            }
        
        } catch (error) {
        }
    }

    const getCampaignData = (data) => {
        campaignName = data.name;
        campaignCurrency = data.currency;
        payEnvKey = data.payment_env_key;
        Spreedly.init(payEnvKey, { "numberEl": "bankcard-number", "cvvEl": "bankcard-cvv" });
    }

    function nextStep() {
        path = location.pathname.split("/");
        campaignPath = path.slice(0, path.length - 1).join("/");
        base = `${location.protocol}//${location.host}`;
        url = new URL(campaignPath + nextURL, base)
        return url.href
    };

    function skipSteps() {
        path = location.pathname.split("/");
        campaignPath = path.slice(0, path.length - 1).join("/");
        base = `${location.protocol}//${location.host}`;
        url = new URL(campaignPath + confirmationURL, base)
        return url.href
    };

    const currency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const removeCurrency = (currencyStr) => {
        return parseFloat(currencyStr.replace(/[$,]/g, '').trim());
    }

    return { 
        getCampaign, 
        getCampaignData, 
        nextStep, 
        skipSteps,
        currency,
        removeCurrency
    };
    
})();





