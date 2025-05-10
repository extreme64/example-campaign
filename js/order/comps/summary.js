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
                <div><span class="selected-shipping-price text-secondary">...</span></div>
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
    
    /**
     * Sets up event listeners for the specified target element.
     *
     * @param {HTMLElement} target - The DOM element to attach the event listener to.
     * Listens for the shipping type change event.
     */
    const setComponentEvents = (target) => {
        target.addEventListener(Shipping.shippingTypeChangeEventName, (event) => {
            selectedShippingPriceEl.textContent = event.detail.price
        });
    }

    /**
     * Adds a selected bundle to the list of displayed bundles.
     *
     * Creates a new HTML element representing
     * the bundle and appends it to the list of selected bundles.
     *
     * @param {Object} bundle - The bundle object containing ref_id, name, and price.
     */
    const addSelectedBundle = (bundle) => {
        const {ref_id: refId, name, price, qty} = bundle;

        if(!block){
            return
        }
        
        const bundlesListEl = block.querySelector(".selected-bundles-list");

        const itemTemplate = `
            <div>
                <span class="selected-product-name">${name}</span> 
            </div>
            <div class=" text-secondary">
                <span class="selected-product-price">${qty} x ${price}</span>
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

    /**
     * Removes a selected bundle from the list based on the provided index.
     *
     * @param {number} index - The index of the bundle to be removed.
     * @returns {void} - Does not return a value.
     */
    const removeSelectedBundle = (index) => {

        if(!block){
            return
        }

        const bundlesListEl = block.querySelector(".selected-bundles-list");
        const childToRemove = block.querySelector(`[data-ref-id='${index}']`);
        bundlesListEl.removeChild(childToRemove);
    }

    /**
     * Initializes the order summary component by creating a new div element,
     * assigning it a specific class, and setting its inner HTML to the provided template.
     * It also selects the element displaying the selected shipping price and
     * sets up event listeners for the component.
     */
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