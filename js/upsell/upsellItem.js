const UpsellItem = (() => {

    /**
     * Create Upsell items
     */
    const render = (items) => {
        const template = `
                    <div class="col-lg-6 py-4 px-0 p-lg-4">
                            <div class="text-center">
                                <div id="id_price_diff" class="fw-bold fs-5">
                                    Flash Sale - Save <span class="value"></span>% Off Today Only
                                </div>
                                <div class="mt-3 py-3 fw-bold fs-4 border-top border-bottom text-secondary">
                                    <span id="id_name" class="fs-2 text-dark">Upsell Product Example</span>
                                </div>
                                <div class="d-lg-none text-center">
                                    <img id="id_item_image" src="img/up1.png" class="img-fluid" width="120">
                                </div>
                               
                                <div class="up-prcBox d-flex justify-content-center align-items-center">
                                    <div class="prc-bx ret-prc p-3 border-end">
                                        <div class="fs-7">Retail Price</div>
                                        <span id="id_price_retail" class="originalPrice fs-1 fw-bold text-muted">$60.00</span>
                                    </div>
                                    <div class="prc-bx ofr-prc p-3">
                                        <div class="fs-7">Offer Price</div>
                                        <span id="id_price_offer" style="color:#000;" class="currentPrice fs-1 fw-bold">$30.00</span>
                                    </div>
                                </div>
                                <div class="clearall"></div>
                                <div class="row justify-content-center">
                                    <div class="col-11 col-sm-9">
                                        <div class="mb-3 d-grid">
                                            <button type="button" class="btn btn-lg btn-success py-3 px-5" data-loading-text="Processing" data-text="Yes! Add To My Order!">
                                                Yes! Add To My Order!
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div id="id_free_shipping" class="d-flex align-items-center justify-content-center mb-3">
                                    Free Shipping In The Same Order
                                </div>
                                
                            </div>
                        </div>

                        <div class="col-lg-6 d-none border-start d-lg-flex justify-content-lg-center align-items-lg-center">
                            <div class="text-center ">
                                <img id="id_item_image_big" src="img/up1.png" class="img-fluid">
                            </div>
                        </div>
                    `;

        const container = document.querySelector(".up-box");

        for (const current of items) {

            // const truncateByDecimalPlace = (value, numDecimalPlaces) => Math.trunc(value * 10 ** numDecimalPlaces) / 10 ** numDecimalPlaces

            const item = document.createElement("div");
            item.classList.add('upsell-item', 'row');

            item.dataset.name = current.name;
            item.dataset.ref_id = current.ref_id;
            item.dataset.qty = current.qty;
            
            item.innerHTML = template;
            
            item.querySelector("#id_name").textContent = current.name;
            const discount = (current.price_retail_total - current.price_total) / current.price_retail_total * 100;
            item.querySelector("#id_price_diff > .value").textContent = Math.floor(discount);
            item.querySelector("#id_item_image").src = current.image;
            item.querySelector("#id_item_image_big").src = current.image;
            item.querySelector("#id_price_retail").textContent = campaign.currency.format(current.price_retail_total);
            item.querySelector("#id_price_offer").textContent = campaign.currency.format(current.price_total);


           if (current?.shippingPrice == 0) {
                item.querySelector("#id_free_shipping").textContent = "Free Shipping In The Same Order";
            } else {
                item.querySelector("#id_free_shipping").textContent = "";
            }

            container.appendChild(item);
        }
    }

    return {
        render
    }
})();
