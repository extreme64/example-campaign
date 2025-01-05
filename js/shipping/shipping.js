const Shipping = (() => {

    const shippingTypeChangeEventName = "shippingTypeChange";
    const defaultSelectedIndex = 1;

    let block;
    let defaultSelectedPrice = null;

    const template =`
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

    const setShippingSelector = (element, types) => {
        let options = '';

        for (const type of types) {
            options += `<option value="${type.ref_id}" data-price="${type.price}">${type.code}</option>`
            if(type.ref_id === defaultSelectedIndex) { defaultSelectedPrice = type.price; }
        }
        element.innerHTML += options
        
        element.value = defaultSelectedIndex;

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

        const selectedShippingPrice = block.querySelector('[data-shipping-price-value]')
        selectedShippingPrice.textContent = '...';
        
        setComponentEvents({selector, selectedShippingPrice});

        return Shipping;
    }

    return {
        shippingTypeChangeEventName,
        render,
        init
    }

})();
