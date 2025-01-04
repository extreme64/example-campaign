const OrderSummary = (() => {

    let selectedShippingPriceEl;
    let block;

    const template = `
        <div class="">
            <div class="h5">Order Summary</div>
        </div>
        <div
            class="d-flex justify-content-between px-3 pt-2 pb-1 border-bottom text-uppercase fs-7">
            <div>Item</div>
            <div>Price</div>
        </div>
        <div class="summary selected-bundles-list flex-column justify-content-between p-3 d-flex fw-bold">

        </div>
        <div class="rounded-3 p-3 bg-xlight">
            <div class="justify-content-between py-2 d-flex fw-bold">
                <div>Shipping:</div>
                <div><span class="selected-shipping-price text-secondary">FREE</span></div>
            </div>
            <div class="d-flex justify-content-between pt-1">
                <div class=" text-dark fw-bold">Today's Total:</div>
                <div><span
                        class="order-summary-total-value fs-5 text-black fw-bold">0</span>
                </div>
            </div>
        </div>`;


    const render = () => {
        return block
    }
    
    const setComponentEvents = (target) => {
        target.addEventListener(Shipping.shippingTypeChangeEventName, (event) => {
            selectedShippingPriceEl.textContent = event.detail.price
        });
    }

    const addSelectedBundle = (bundle) => {
        const {ref_id: refId, name, price} = bundle;

        if(!block){
            return
        }
        
        const bundlesListEl = block.querySelector(".selected-bundles-list");

        const itemTemplate = `
            <div>
                <span class="selected-product-name">${name}</span> 
            </div>
            <div class=" text-secondary">
                <span class="selected-product-price">${price}</span>
                <span class="fs-8"> /ea</span>
            </div>`

        const itemFragment = document.createElement('div');
        itemFragment.classList.add('d-flex');
        itemFragment.classList.add('w-100');
        itemFragment.classList.add('justify-content-between');
        itemFragment.dataset.refId = refId;
        itemFragment.innerHTML = itemTemplate;

        bundlesListEl.appendChild(itemFragment);
    }

    const removeSelectedBundle = (index) => {

        if(!block){
            return
        }

        const bundlesListEl = block.querySelector(".selected-bundles-list");
        const childToRemove = block.querySelector(`[data-ref-id='${index}']`);
        bundlesListEl.removeChild(childToRemove);
    }

    const init = () => {

        block = document.createElement("div");
        block.classList.add('order-summary-comp');
        block.innerHTML = template;

        selectedShippingPriceEl = block.querySelector('.selected-shipping-price');
        
        setComponentEvents(document);
    }

    return {
        addSelectedBundle,
        removeSelectedBundle,
        render,
        init
    }

})()

OrderSummary.init()