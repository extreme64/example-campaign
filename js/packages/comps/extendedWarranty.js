const ExtendedWarranty = (() => {

    const emitsEventName = {
        extendedWarrantyClicked: 'extendedWarrantyClicked'
    };
    const isOnlyOne = true;
    let isOneCreated = false;
    let oneCreatedRefId = null;

    let block;
    let isExtendedWarrantyChcked = false;

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

    const render = () => { return block }

    const isSelected = () => { return isExtendedWarrantyChcked }

    const extendedWarrantyClickedHandler = (event, packageId) => {

        const element = event.target.closest('.offer');

        if (isSelected() === false) {
            let index = lineArr.findIndex(item => item.package_id == packageId);
            lineArr.splice(index, 1);
        } else {
            lineArr.push({
                package_id: packageId,
                is_upsell: true
            })
        }

        console.log('lineArr', lineArr);

    }

    const getOneSelectedRefId = () => {
        return oneCreatedRefId;
    }


    const init = (product) => {

        if(isOneCreated) return ExtendedWarranty;

        oneCreatedRefId = product.ref_id;

        block = document.createElement("div");
        block.classList.add('extended-warranty-comp');

        block.dataset.packageId = product.ref_id;
        block.dataset.externalId = product.external_id;
        block.dataset.refId = product.ref_id;
        block.dataset.price = product.price;
        block.dataset.name = product.name;
        block.dataset.qty = product.qty;

        block.dataset.isOnlyOne = isOnlyOne;

        block.innerHTML = template;

        console.log(product);


        block.querySelector('#id_extended_warranty_product_cbx')
            .addEventListener('click', function (event) {
                isExtendedWarrantyChcked = !isExtendedWarrantyChcked;
                document.dispatchEvent(new CustomEvent(emitsEventName.extendedWarrantyClicked, {
                    detail: {
                        product
                    }
                }));

                Cart.calculateTotalWithUpsells();

                extendedWarrantyClickedHandler(event, product.ref_id);
            });

        isOneCreated = true;

        return ExtendedWarranty
    }


    return {
        emitsEventName,
        getOneSelectedRefId,
        isSelected,
        render,
        init
    }

})();