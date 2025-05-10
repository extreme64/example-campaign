/**
 * A module for managing shipping components in a web application.
 *
 * This module provides functionality to initialize a shipping component,
 * set event handlers for shipping type changes, and update the shipping
 * selector options. It includes methods to render the component, initialize
 * it with shipping types, and handle changes in shipping selection.
 *
 * @module Shipping
 * 
 * @const shippingTypeChangeEventName,
 * @function render,
 * @function init
 * 
 */
const Shipping = (() => {

    /**
     * The event name for shipping type change events.
     */
    const shippingTypeChangeEventName = "shippingTypeChange";

    /**
     * The default index for the selected shipping type.
     */
    const defaultSelectedIndex = 1;

    let block;
    let selectedShippingPrice;

    /**
     * Init. selected price.
     */
    let defaultSelectedPrice = null;

    const template = `
        <div class="">
            <div class="h5">Select Shipping</div>
        </div>
        <div class="justify-content-between p-3 d-flex fw-bold">
            <select class="form-select" name="shipping_types" id="id_shipping_types">
                <option value="-1" selected="" data-price="...">Select type</option>
            </select>
            <div class="invalid-message invalid-shipping_types ps-2">
            </div>
        </div>
        <div class="rounded-3 p-3 bg-xlight">
            <div class="justify-content-between py-2 d-flex fw-bold">
                <div>Shipping:</div>
                <div><span class="selected-shipping-price text-secondary" data-shipping-price-value>FREE</span></div>
            </div>
        </div>`;

    const render = () => {
        return block
    }

    /**
     * Sets event handlers for a shipping component.
     *
     * @param {Object} target - The target object containing the component elements.
     * @param {HTMLElement} target.selector - The HTML select element for shipping options.
     * @param {HTMLElement} target.selectedShippingPrice - The element to display the selected shipping price.
     *
     * @description
     * This function assigns an 'onchange' event to the provided selector element. 
     * When the selected option changes, it updates the displayed shipping price 
     * and dispatches a custom event if `shippingTypeChangeEventName` is defined.
     * It also updates the value of the shipping method input field.
     *
     * @throws Will log an error if the target object is missing required properties 
     * or if the selected option lacks a 'data-price' attribute.
     */
    const setComponentEvents = (target) => {

        const { selector, selectedShippingPrice } = target;

        if (!selector || !selectedShippingPrice) {
            console.error("Invalid target object: missing 'selector' or 'selectedShippingPrice'");
            return;
        }

        selector.onchange = (event) => {
            const selectedOption = event.target.options[event.target.selectedIndex];
            const price = selectedOption.dataset.price;

            if (price) {
                selectedShippingPrice.textContent = price;

                // Ensure shippingTypeChangeEventName is defined
                if (typeof shippingTypeChangeEventName === 'undefined') {
                    console.error("shippingTypeChangeEventName is not defined");
                } else {
                    document.dispatchEvent(new CustomEvent(shippingTypeChangeEventName, { detail: selectedOption.dataset }));
                }

            } else {
                console.error("Selected option does not have a 'data-price' attribute");
            }

            document.querySelector("#shipping_method").value = selectedOption.value
        };
    }

    /**
     * Sets the shipping selector options based on the provided types and updates the element's value.
     * Dispatches a custom event with the selected shipping type's price.
     *
     * @param {HTMLElement} element - The DOM element to update with shipping options.
     * @param {Array} types - An array of shipping type objects, each containing `ref_id`, `price`, and `code`.
     */
    const setShippingSelector = (element, types) => {
        let options = '';

        for (const type of types) {
            options += `<option value="${type.ref_id}" data-price="${type.price}">${type.code}</option>`
            if (type.ref_id === defaultSelectedIndex) { defaultSelectedPrice = type.price; }
        }
        element.innerHTML += options

        element.value = defaultSelectedIndex;

        selectedShippingPrice = block.querySelector('[data-shipping-price-value]')
        selectedShippingPrice.textContent = defaultSelectedPrice;

        const event = new CustomEvent(Shipping.shippingTypeChangeEventName, {
            detail: {
                price: defaultSelectedPrice
            }
        });
        document.dispatchEvent(event);
    }

    const init = (shippingTypes) => {

        block = document.createElement("div");
        block.classList.add('shipping-comp');
        block.innerHTML = template;

        const selector = block.querySelector("#id_shipping_types");
        setShippingSelector(selector, shippingTypes);
        
        setComponentEvents({ selector, selectedShippingPrice });

        return Shipping;
    }

    return {
        shippingTypeChangeEventName,
        render,
        init
    }

})();
