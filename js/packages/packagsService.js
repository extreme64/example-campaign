
const PackagesService = (function() {

    let bundlesContainer = undefined;
    let extendedWarentyContainer = undefined;
  

    const renderItems = (dataSet) => {
        
        dataSet.forEach(item => {

            // Render packed component
            if(config.campaignUpsellsIds.includes(item.external_id)) {
              //...
            }else if(config.extraProductsId.includes(item.external_id)) {
                extendedWarentyContainer.appendChild(ExtendedWarranty.init(item).render());
            }else {
                bundlesContainer.appendChild(Packages.renderItem(item));
            }
        });
    }

    const init = () => {
        bundlesContainer = document.querySelector(".offers");
        extendedWarentyContainer = document.querySelector(".extra-product__comp-wrap");
    }

    return {
        renderItems,
        init
    };
})();