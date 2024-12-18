// Variables
let lineArr = [];


// form
const formEl = document.querySelector('.form');
const firstName = document.querySelector("#id_first_name");
const lastName = document.querySelector("#id_last_name");
const email = document.querySelector("#id_email");
const expMonth = document.getElementById("id_expiry_month");
const expYear = document.getElementById("id_expiry_year");
const cvvParent = document.getElementById("bankcard-cvv");
const numberParent = document.getElementById("bankcard-number");
const cardErrBlock = document.getElementById("payment-error-block")

const ccCheckbox = document.getElementById('id_use_new_card');
const addCheckbox = document.getElementById('id_same_as_shipping');
const formCC = document.getElementById('form-cc');
const formShip = document.getElementById('form-shipping');
const formBill = document.getElementById('form-billing');
const validErrBlock = document.getElementById("validation-error-block")

// pay method buttons
const btnPaypal = document.querySelector('.pay-with-paypal');
const btnCreditCard = document.querySelector(".pay-with-cc");

// Selected Offer
const offersParentEl = document.querySelectorAll('.offers');

// Total
const summaryShipPrice = document.querySelector(".order-summary-total-value")


const retrieveCampaign = campaign.once(campaign.getCampaign);
const container = document.querySelector(".offers");
container.innerHTML = '';
retrieveCampaign();


const sendProspect = campaign.once(Cart.create);



// 
// Inits & Event Listeners
// 
document.addEventListener("DOMContentLoaded", (event) => {

    Packages.renderPackages();

    const firstLineItem = { package_id: selectedOfferId, quantity: 1, is_upsell: false };

    lineArr.push(firstLineItem);

    const summaryShipPrice = document.querySelector('.selected-shipping-price');

    const $offer = document.querySelectorAll('.offer');

    if ($offer) {

        $offer.forEach((el, key) => {

            el.addEventListener('click', function () {

                el.classList.toggle("selected");

                const pid = el.dataset.packageId;

                const pName = el.dataset.name;

                const pPriceEach = el.dataset.priceEach;

                const pPriceShipping = el.dataset.priceShipping;

                const shippingMethod = el.dataset.shippingMethod;

                const pQuantity = el.dataset.quantity;

                document.getElementById('shipping_method').value = shippingMethod;
                document.querySelector('.selected-product-name').textContent = pName;

                document.querySelector('.selected-product-price').textContent = campaign.currency.format(pPriceEach);

                summaryShipPrice.text = pPriceShipping == 0.00 ? "FREE" : campaign.currency.format(pPriceShipping);

                $offer.forEach((ell, els) => {
                    if (key !== els) {
                        ell.classList.remove('selected');
                    }

                });

                firstLineItem.package_id = pid


                console.log("Change Line Items:", lineArr);

                Utill.calculateTotal()

            });
        });
    }


    // initial package setup
    for (const offer of $offer) {

        packageId = offer.dataset.packageId;
        shippingId = offer.dataset.shippingMethod;
        
        if (packageId === selectedOfferId) {
            offer.classList.add('selected');
            offer.style.order = '-1';

            document.getElementById('shipping_method').value = shippingId;
            document.querySelector('.selected-product-name').textContent = offer.dataset.name;
            document.querySelector('.selected-product-price').textContent = campaign.currency.format(offer.dataset.priceEach);
            
            if (offer.dataset.priceShipping != 0.00) {
                summaryShipPrice.textContent = campaign.currency.format(offer.dataset.priceShipping);
            } else {
                summaryShipPrice.textContent = "FREE";
            }
        }
    }

    console.log("Default Line Items:", lineArr);
    Utill.calculateTotal()

});


firstName.addEventListener('blur', Prospect.create);
lastName.addEventListener('blur', Prospect.create);
email.addEventListener('blur', Prospect.create);

btnPaypal.addEventListener('click', event => {
    validate.revalidateField('#id_first_name'),
    validate.revalidateField('#id_last_name'),
    validate.revalidateField('#id_email')
        .then(isValid => {
            if (isValid) {
                console.log('Paypal Button Clicked');
                document.getElementById('payment_method').value = 'paypal';
                PaypalOrder.create();
            } else {
                document.querySelector('.is-invalid').focus();
            }
        });
});

btnCreditCard.addEventListener('click', event => {
    formEl.requestSubmit();
});

