const Utils = (() => {

    /**
     * Calculate totals 
     */
    const calculateTotal = () => {

        const selectedPackage = document.querySelector(".offer.selected");

        if (selectedPackage === null) {
            return;
        }
        
        let packagePrice
        const shippingPrice = selectedPackage.dataset.priceShipping

        packagePrice = selectedPackage.dataset.priceTotal;

        const checkoutTotal = parseFloat(packagePrice) + parseFloat(shippingPrice);

        const orderTotal = document.querySelector(".order-summary-total-value");

        orderTotal.textContent = campaign.currency.format(checkoutTotal);
    }


    return {
        calculateTotal
    }

})()