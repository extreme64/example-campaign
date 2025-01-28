const Cart = (() => {

    const cartsCreateURL = 'https://campaigns.apps.29next.com/api/v1/carts/'

    /**
     *  Create Cart / New Prospect
     */
    const create = async () => {

        console.log("create prospect");
        const formData = new FormData(formEl);
        const data = Object.fromEntries(formData);

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

    const calculateTotalWithUpsells = () => {

        const orderTotal = document.querySelector(".order-summary-total-value");

        const selectedPackages = document.querySelectorAll(".offer.selected");

        if(!selectedPackages){
            return
        }


        const totalPrice = Array.from(selectedPackages).reduce((total, item) => {
            return total + parseFloat(item.dataset.priceTotal);
        }, 0);

        let ewt = 0;
        if(ExtendedWarranty.isSelected() == true){
            ewt = ExtendedWarranty.getTotal(getTotalQty());
        } 

        orderTotal.textContent = Campaign.currency.format(totalPrice + ewt);
    }

    const getTotalQty = () => {

        const selectedPackages = document.querySelectorAll(".offer.selected");

        if(!selectedPackages){
            return
        }


        const totalQuantity = Array.from(selectedPackages).reduce((total, item) => {
            return total + parseFloat(item.dataset.quantity);
        }, 0);


        return totalQuantity;

    }

    return {
        create,
        calculateTotal,
        calculateTotalWithUpsells,
        getTotalQty
    }

})();

