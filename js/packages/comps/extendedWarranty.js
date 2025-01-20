const ExtendedWarranty = (() => {

    let block;
    let isExtendedWarrantyChcked = false;
    const emitsEventName = {
        extendedWarrantyClicked: 'extendedWarrantyClicked'};

    const template = `
        <input type="checkbox" class="form-check-input" id="id_extended_warranty_product_cbx"
            onclick="" >
        <label class="form-check-label" for="id_extended_Warranty_product_cbx">YES, I want Extended Warranty</label>
        <p class="fs-8 text-secondary">
            <b>
                One time offer:
            </b>
            By placing your order today, you can have an extended warranty and replacement plan. 
            This means you will be covered for 2 years.
        </p>
    `;

    const render = () => { return block}

    const extendedWarrantyClciked = () => {
        isExtendedWarrantyChcked = block.querySelector('#id_extended_warranty_product_cbx').checked;
        console.log(
            emitsEventName.extendedWarrantyClicked, 
            isExtendedWarrantyChcked
        );
    }

    const init = () => {
        block = document.createElement("div");
        block.classList.add('extended-warranty-comp');
        block.innerHTML = template;

        block.querySelector('#id_extended_warranty_product_cbx')
            .addEventListener('click', extendedWarrantyClciked);

        return ExtendedWarranty
    }


    return {
        emitsEventName,
        render,
        init
    }

})();