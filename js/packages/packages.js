const Packages = (() => {

    const events = {
        componentLoaded: "componentLoaded",
        itemsHydrated: "itemsHydrated",
        selectedItem: 'bundleSelected'
    }

    let blocks = [];

    const template = `
        <div class="offer-header d-flex justify-content-between align-items-center border-bottom">
            <div class="offer-title d-flex align-items-center px-3">
                <span class="offer-title-text fs-5  text-nowrap"></span>
            </div>
            <div class="px-3 py-3 text-nowrap fs-7 fw-bold">
                <span class="shipping-cost"></span> SHIPPING
            </div>
        </div>
        <div class="offer-content d-flex align-items-center ps-4 py-2">
            <div class="offer-content-img">
                <img src="" class="img-fluid p-image">
            </div>
            <div class="offer-content-info pe-2 ms-3">
                <div class="offer-content-price-each  text-primary">
                    <span class="price-each h4 fw-bold"></span>
                    <span class="fs-8 fw-light">/each</span>
                </div>
                <div class="offer-content-price-orig text-secondary">
                    <s> 
                    Orig
                        <span class="price-each-retail"></span>
                    </s>
                </div>
                <div class="offer-content-price-total h6 fw-bold text-success">
                    Total:
                    <span class="price-total"></span>
                </div>
            </div>
        </div>`;

    /**
     * Create Packages
     */
    const render = () => {
        const fragment = document.createElement("fragment");
        blocks.map((item) => {
            fragment.appendChild(item)
        })
        return fragment;
    }

    const offerClickHandler = (event, packageId) => {
        const offerElement = event.target.closest('.offer');

        if (offerElement.classList.contains('selected')) {
            offerElement.classList.remove('selected');
            lineArr.splice(parseInt(offerElement.dataset.packageId) - 1, 1);
        } else {
            offerElement.classList.add('selected');
            lineArr.push({
                package_id: packageId,
                is_upsell: false
            })
        }
    }

    const init = (offers) => {

        for (const package of offers) {

            const item = document.createElement("div");
            
            item.classList.add('offer');
            item.dataset.packageId = package.ref_id;
            item.dataset.name = package.name;
            item.dataset.quantity = package.qty;
            item.dataset.priceTotal = package.price_total;
            item.dataset.priceEach = package.price;
            //  item.dataset.priceShipping = package.shippingPrice;
            //  item.dataset.shippingMethod = package.shippingMethod;
            item.innerHTML = template;

            item.querySelector(".offer-title-text").textContent = package.name;
            item.querySelector(".p-image").src = package.image;
            item.querySelector(".price-each-retail").textContent = Campaign.currency.format(package.price_retail_total);

            // prices
            const priceElement =item.querySelector('.price-each');
            const priceTotalElement =item.querySelector('.price-total');

            priceElement.textContent = Campaign.currency.format(package.price);
            priceTotalElement.textContent = Campaign.currency.format(package.priceTotal);

            // const truncateByDecimalPlace = (value, numDecimalPlaces) => Math.trunc(value * 10 ** numDecimalPlaces) / 10 ** numDecimalPlaces

            if (package.shippingPrice == 0) {
                item.querySelector(".shipping-cost").textContent = "FREE";
            } else {
                item.querySelector(".shipping-cost").textContent = package.shippingPrice;
                item.querySelector(".offer-content-price-total").style.display = "none"
            }


            item.addEventListener('click', (event) => {

                const blockEl = event.target.closest('.offer');
                
                if(blockEl == undefined){
                    blockEl =event.target;
                }

                if(blockEl.classList.contains('selected')){
                    OrderSummary.removeSelectedBundle(package.ref_id);
                }else{
                    OrderSummary.addSelectedBundle(package);
                }
                
                offerClickHandler(event, package.ref_id);
                
                Cart.calculateTotal();
            });

            blocks.push(item);
        }

        const bundleSelectedEvent = new CustomEvent(events.componentLoaded, {
            detail: {}
        });
        document.dispatchEvent(bundleSelectedEvent);

        return Packages;
    }

    return {
        events,
        render,
        init
    }

})();
