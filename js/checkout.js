// Variables
let lineArr = [];


// form
const formEl = document.querySelector('.form');
const firstName = document.querySelector("#id_first_name");
const lastName = document.querySelector("#id_last_name");

const billingFirstName = document.querySelector("#id_billing_first_name");
const billingLastName = document.querySelector("#id_billing_last_name");

const email = document.querySelector("#id_email");
const expMonth = document.getElementById("id_expiry_month");
const expYear = document.getElementById("id_expiry_year");
const cvvParent = document.getElementById("bankcard-cvv");
const numberParent = document.getElementById("bankcard-number");
const cardErrBlock = document.getElementById("payment-error-block")

const ccCheckbox = document.getElementById('id_use_new_card');
// const addCheckbox = document.getElementById('id_same_as_shipping');
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


const retrieveCampaign = Utils.once(Campaign.getCampaign);
const container = document.querySelector(".offers");
container.innerHTML = '';
retrieveCampaign();


const sendProspect = Utils.once(Cart.create);

// Billing address cehckbox
const chkBxBillingAddress = document.getElementById('id_same_as_shipping');

const billingAddressFormPArt = document.getElementById('form-billing');
billingAddressFormPArt.style.display = 'none';


// 
// Inits & Event Listeners
// 
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

chkBxBillingAddress.addEventListener('change', event => {
    const checkbox = event.currentTarget
    console.log('Show', 'billing form part'); 

    if (checkbox.checked) {
        billingAddressFormPArt.style.display = 'none';
        return;
    }
    billingAddressFormPArt.style.display = 'block';
    checkbox.removeAttribute("checked");
    ;
})