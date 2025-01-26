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
     * Renders bundles list fragment.
     * 
     * @returns {DocumentFragment} The constructed document fragment containing all appended items.
     */
    const render = () => {
        const fragment = document.createElement("fragment");
        blocks.map((item) => {
            fragment.appendChild(item)
        })
        return fragment;
    }

    const renderItem = (itemData) => {
        bundlesContainer = document.querySelector(".offers");
        return createItemElement(itemData);
    }

    const createItemElement = (package) => {
        const item = document.createElement("div");
            
        item.classList.add('offer');
        item.dataset.packageId = package.ref_id;
        item.dataset.name = package.name;
        item.dataset.quantity = package.qty;
        item.dataset.priceTotal = package.price_total;
        item.dataset.priceEach = package.price;

        item.innerHTML = template;

        item.querySelector(".offer-title-text").textContent = package.name;
        item.querySelector(".p-image").src = package.image;
        item.querySelector(".price-each-retail").textContent = Campaign.currency.format(package.price_retail_total);

        // prices
        const priceElement =item.querySelector('.price-each');
        const priceTotalElement =item.querySelector('.price-total');

        priceElement.textContent = Campaign.currency.format(package.price);
        priceTotalElement.textContent = Campaign.currency.format(package.priceTotal);

        if (package.shippingPrice == 0) {
            item.querySelector(".shipping-cost").textContent = "FREE";
        } else {
            item.querySelector(".shipping-cost").textContent = package.shippingPrice;
            item.querySelector(".offer-content-price-total").style.display = "none"
        }


        item.addEventListener('click', (event) => {

            const packageEl = event.target.closest('.offer');
            
            if(packageEl == undefined){
                packageEl =event.target;
            }

            if(packageEl.classList.contains('selected')){
                OrderSummary.removeSelectedBundle(package.ref_id);
            }else{
                OrderSummary.addSelectedBundle(package);
            }
            
            packageClickHandler(event, package.ref_id);
            
            Cart.calculateTotal();

            const bundleSelectedEvent = new CustomEvent(events.selectedItem, { detail: {
                package:package
            } });
            document.dispatchEvent(bundleSelectedEvent);

        });

        return item;
    }

    /**
     * Handles the click event on an offer element, toggling its 'selected' state.
     * If the offer is selected, it adds the package to the lineArr array.
     * If the offer is deselected, it removes the package from the lineArr array.
     *
     * @param {Event} event - The click event triggered on the offer element.
     * @param {number} packageId - The ID of the package associated with the offer.
     */
    const packageClickHandler = (event, packageId) => {
        const element = event.target.closest('.offer');

        if (element.classList.contains('selected')) {
            element.classList.remove('selected');
            // refactor to find items index, that has same package_id 
            let index = lineArr.findIndex(item => item.package_id == packageId);
            lineArr.splice(index, 1);
        } else {
            element.classList.add('selected');
            lineArr.push({
                package_id: packageId,
                is_upsell: false
            })
        }
    }

    const init = (packages) => {

        for (const package of packages) {
            createItemElement(package);
            blocks.push(package);
        }

        const bundlesLoadedEvent = new CustomEvent(events.componentLoaded, { detail: {} });
        document.dispatchEvent(bundlesLoadedEvent);

        return Packages;
    }

    return {
        events,
        render,
        renderItem,
        init
    }

})();
