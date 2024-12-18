const Packages = (() => {


    /**
     * Create Packages
     */

    const renderPackages = () => {
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
                       
                    </div>
                    `;

        const container = document.querySelector(".offers");

        for (const package of offers.packages) {

            const item = document.createElement("div");
            item.classList.add('offer');
            item.dataset.packageId = package.id;
            item.dataset.name = package.name;
            item.dataset.quantity = package.quantity;
            item.dataset.priceTotal = package.priceTotal;
            item.dataset.priceEach = package.price;
            item.dataset.priceShipping = package.shippingPrice;
            item.dataset.shippingMethod = package.shippingMethod;
            item.innerHTML = template;
            item.querySelector(".offer-title-text").textContent = package.name;
            item.querySelector(".p-image").src = package.image;
            item.querySelector(".price-each-retail").textContent = campaign.currency.format(package.price_retail);


            // prices
            const priceElement = item.querySelector('.price-each');
            const priceTotalElement = item.querySelector('.price-total');

            priceElement.textContent = campaign.currency.format(package.price);
            priceTotalElement.textContent = campaign.currency.format(package.priceTotal);

            const truncateByDecimalPlace = (value, numDecimalPlaces) => Math.trunc(value * 10 ** numDecimalPlaces) / 10 ** numDecimalPlaces

            if (package.shippingPrice == 0) {
                item.querySelector(".shipping-cost").textContent = "FREE";
            } else {
                item.querySelector(".shipping-cost").textContent = package.shippingPrice;
                item.querySelector(".offer-content-price-total").style.display = "none"
            }

            container.appendChild(item);
        }
    }


    return {
        renderPackages
    }

})();
