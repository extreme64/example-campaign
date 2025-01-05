
const PaypalOrder = (() => {


    /**
     * Use Create Order with PayPal
     */

    const create = async () => {
        console.log("create order paypal order");
        const formData = new FormData(formEl);
        const data = Object.fromEntries(formData);
        btnPaypal.disabled = true;
        const orderPPData = {
            "user": {
                "first_name": data.first_name,
                "last_name": data.last_name,
                "email": data.email,
            },
            "lines": lineArr,
            "payment_detail": {
                "payment_method": data.payment_method,
            },
            "shipping_method": data.shipping_method,
            "success_url": campaign.nextStep(nextURL)
        }

        try {
            const response = await fetch(config.ordersURL, {
                method: 'POST',
                headers,
                body: JSON.stringify(orderPPData),
            });
            const result = await response.json()

            if (!response.ok) {
                console.log('Something went wrong');
                console.log(orderPPData);
                btnPaypal.disabled = false;
                return;
            }

            console.log(result)

            sessionStorage.setItem('ref_id', result.ref_id);

            window.location.href = result.payment_complete_url;

        } catch (error) {
            console.log(error);
        }
    }

    return {
        create
    }

})();