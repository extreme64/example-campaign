const CardOrder = (() => {


    /**
     * Use Create Order with Credit Card
     */
    const create = async () => {

        console.log("create order");
        const formData = new FormData(formEl);
        const data = Object.fromEntries(formData);

        btnCreditCard.disabled = true;
        btnCreditCard.textContent = btnCreditCard.dataset.loadingText;
        validErrBlock.innerHTML = ``

        const orderData = {
            "user": {
                "first_name": data.first_name,
                "last_name": data.last_name,
                "email": data.email,
            },
            "lines": lineArr,

            "use_default_shipping_address": false,

            "use_default_billing_address": false,
            "billing_same_as_shipping_address": data.billing_same_as_shipping_address,
            "payment_detail": {
                "payment_method": data.payment_method,
                "card_token": 'test_card',
            },
            "shipping_address": {
                "first_name": data.first_name,
                "last_name": data.last_name,
                "line1": data.shipping_address_line1,
                "line4": data.shipping_address_line4,
                "state": data.shipping_state,
                "postcode": data.shipping_postcode,
                "phone_number": data.phone_number,
                "country": data.shipping_country
            },
            "shipping_method": data.shipping_method,
            "success_url": campaign.nextStep(nextURL)
        }


        try {
            const response = await fetch(ordersURL, {
                method: 'POST',
                headers,
                body: JSON.stringify(orderData),
            });
            const result = await response.json()

            // Some examples of error handling from the API to expand on
            if (!response.ok && result.non_field_errors) {

                btnCreditCard.disabled = false;
                btnCreditCard.textContent = btnCreditCard.dataset.text;

                console.log('Something went wrong', result);
                let error = result.non_field_errors;
                validErrBlock.innerHTML = `
                <div class="alert alert-danger">
                    ${error}
                </div>
            `;
                return;

            } else if (!response.ok && result.postcode) {

                btnCreditCard.disabled = false;
                btnCreditCard.textContent = btnCreditCard.dataset.text;

                console.log('ZIP is incorrect', result);
                let error = result.postcode;
                validErrBlock.innerHTML = `
                <div class="alert alert-danger">
                    API Response Error: ${error}
                </div>
            `;
                return;

            } else if (!response.ok && result.shipping_address) {

                btnCreditCard.disabled = false;
                btnCreditCard.textContent = btnCreditCard.dataset.text;

                console.log('Phone number is not accepted', result);
                let error = result.shipping_address.phone_number;
                validErrBlock.innerHTML = `
                <div class="alert alert-danger">
                    API Response Error: ${error}
                </div>
            `;
                return;

            } else if (!response.ok) {

                btnCreditCard.disabled = false;
                btnCreditCard.textContent = btnCreditCard.dataset.text;

                console.log('Something went wrong', result);
                let error = Object.values(result)[0];

                let errorMessageAll = '';
                if (Array.isArray(result.message)) {
                    result.message.forEach(err => {
                        // Loop through each property in the error object
                        for (const [key, value] of Object.entries(err)) {
                            if (Array.isArray(value)) {
                                // Concatenate all error messages for the property
                                errorMessageAll += `<div class="alert alert-danger">
                                                ${key}: ${value.join(', ')}\n
                                            </div>`;
                            }
                        }
                    });
                }

                document.getElementById("payment-error-block").innerHTML = errorMessageAll;

                return;
            }

            sessionStorage.setItem('ref_id', result.ref_id);

            if (!result.payment_complete_url && result.number) {

                location.href = campaign.nextStep(nextURL);

            } else if (result.payment_complete_url) {

                window.location.href = result.payment_complete_url;
            }

        } catch (error) {
            console.log(error);
        }

    }


    return {
        create
    }

})();

