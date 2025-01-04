//  FIXME: + From global to prop. place
const campaignRetrieveURL = 'https://campaigns.apps.29next.com/api/v1/campaigns/';
const cartsCreateURL = 'https://campaigns.apps.29next.com/api/v1/carts/'
const ordersURL = 'https://campaigns.apps.29next.com/api/v1/orders/'
const headers = {
    'Content-Type': 'application/json',
    'Authorization': publicKey
}

const Campaign = (() => {

    const confirmationURL = "/thank-you.html";

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
            
            const shippingContainer = document.querySelector('.shipping__comp-wrap');
            shippingContainer.appendChild(Shipping.init(data.shipping_methods).render());
            
            const orderSummaryContainer = document.querySelector('.order-summary__comp-wrap');
            orderSummaryContainer.appendChild(OrderSummary.render());
            
            offers = getBundles(data);
            getCampaignData(data);

            const bundlesContainer = document.querySelector(".offers");
            bundlesContainer.appendChild(Packages.init(offers).render());

        
            if (!offersParentEl[0]) {
                return
            }

            const offersNew = offersParentEl[0].querySelectorAll('.offer');

            if (offersNew !== undefined) {

                offersNew.forEach((offer) => {
                   
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getBundles = (data) => {
    
        return data.packages.reduce((accumulator, item) => {
            if (!config.campaignUpsellsIds.includes(item.external_id)) {
                accumulator.push(item);
            }
            return accumulator;
        }, []);
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
        url = new URL(campaignPath + config.nextUrlThankYou, base)
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