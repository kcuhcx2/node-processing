module.exports = {
  accumulateCountryCurrencyData: function(countryCurrencyData,result,Cost,Revenue,Profit){
    // We Start constructing the country data object
    // Find if exists currently
    if (!countryCurrencyData.hasOwnProperty(result.Country)) {
      countryCurrencyData[result.Country] = {
        Total: {
          Cost,
          Revenue,
          Profit,
        },
        ItemTypes: {
          [result["Item Type"]]: {
            Cost,
            Revenue,
            Profit,
          },
        },
      };
    } else {
      // Updates the existing costs if already present 
      countryCurrencyData[result.Country].Total.Cost += Cost;
      countryCurrencyData[result.Country].Total.Revenue += Revenue;
      countryCurrencyData[result.Country].Total.Profit += Profit;
  
      // Process item types for each country
      const itemTypes = countryCurrencyData[result.Country].ItemTypes;
      if (!itemTypes[result["Item Type"]]) {
        itemTypes[result["Item Type"]] = {
          Cost,
          Revenue,
          Profit,
        };
      } else {
        // Sum item type values
        itemTypes[result["Item Type"]].Cost += Cost;
        itemTypes[result["Item Type"]].Revenue += Revenue;
        itemTypes[result["Item Type"]].Profit += Profit;
      }
    }
  
    return countryCurrencyData;
  }
}