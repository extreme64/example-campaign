const Cart = (() => {

    /**
     *  Create Cart / New Prospect
     */
    const create = async () => {

        console.log("create prospect");
        const formData = new FormData(formEl);
        const data = Object.fromEntries(formData);

        console.log(data);

        const cartData = {
            "user": {
                "first_name": data.first_name,
                "last_name": data.last_name,
                "email": data.email
            },
            "lines": lineArr
        }

        try {
            const response = await fetch(cartsCreateURL, {
                method: 'POST',
                headers,
                body: JSON.stringify(cartData),
            });
            const result = await response.json()

            if (!response.ok) {
                console.log('Something went wrong');
                return;
            }


        } catch (error) {
            console.log(error);

        }
    }

    const calculateTotal = () => {

        const orderTotal = document.querySelector(".order-summary-total-value");

        const selectedPackages = document.querySelectorAll(".offer.selected");

        if(!selectedPackages){
            return
        }


        const totalPrice = Array.from(selectedPackages).reduce((total, item) => {
            return total + parseFloat(item.dataset.priceTotal);
        }, 0);


        orderTotal.textContent = Campaign.currency.format(totalPrice);

    }

    return {
        create,
        calculateTotal
    }

})();

