module.exports = {
  getPostProccessingCurrencyRoundingForTimeAvg: function(averageTimeToShip){
    // Post processing average ship time to calculate the average within months by the totalDaysToShip - timesOrderedWithinMonth
    Object.entries(averageTimeToShip).forEach(([year, months]) => {
      Object.entries(months).forEach(([month, average]) => {
        let shippingDetails = averageTimeToShip[year][month];
        shippingDetails.AvgDaysToShip = Math.floor(
          average.totalDaysToShip / average.timesOrderedWithinMonth
        );
  
        Object.entries(average.Regions).forEach(([region,regionShippingDetail]) => {
          regionShippingDetail.AvgDaysToShip = Math.floor(
            regionShippingDetail.totalDaysToShip / regionShippingDetail.timesOrderedWithinMonth
          );
  
          Object.entries(regionShippingDetail.Countries).forEach(([country,countryShippingDetail,]) => {
            countryShippingDetail.AvgDaysToShip = Math.floor(
              countryShippingDetail.totalDaysToShip / countryShippingDetail.timesOrderedWithinMonth
            );
          });
        });
      });
    });

    return averageTimeToShip;
  },

  getPostProccessingCurrencyRoundingForRegions: function(regionsOutput){
    Object.entries(regionsOutput.Regions).forEach(([regionName,regionDetails]) => {
      regionDetails.Total.Revenue = Math.floor(regionDetails.Total.Revenue);
      regionDetails.Total.Cost = Math.floor(regionDetails.Total.Cost);
      regionDetails.Total.Profit = Math.floor(regionDetails.Total.Profit);

      // Tidying up countries within regions costs
      Object.entries(regionDetails.Countries).forEach(([countryName,countryDetails]) => {
        countryDetails.Total.Revenue = Math.floor(countryDetails.Total.Revenue);
        countryDetails.Total.Cost = Math.floor(countryDetails.Total.Cost);
        countryDetails.Total.Profit = Math.floor(countryDetails.Total.Profit);

        // Tidying up item Types within countries
        Object.entries(countryDetails.ItemTypes).forEach(([itemTypeName,itemTypeDetails]) => {
          itemTypeDetails.Revenue = Math.floor(itemTypeDetails.Revenue);
          itemTypeDetails.Cost = Math.floor(itemTypeDetails.Cost);
          itemTypeDetails.Profit = Math.floor(itemTypeDetails.Profit);
        });
      });
    });

    return regionsOutput;
  },

  postProcessingCountriesWithinRegions: function(regionData,regionsOutput,countryCurrencyData){
    Object.entries(regionData).forEach(([regionName, countryList]) => {
      // Initialise the region
      regionsOutput.Regions[regionName] = {};

      // Adding all of the countries revenue totals for each region
      let regionTotals = {};

      // Assign local region output to a country
      let localRegionOutput = {};
      countryList.forEach((country) => {
        localRegionOutput[country] = countryCurrencyData[country];

        // Adding all of the countries costs within a region
        const Cost = parseFloat(countryCurrencyData[country].Total.Cost);
        const Revenue = parseFloat(countryCurrencyData[country].Total.Revenue);
        const Profit = parseFloat(countryCurrencyData[country].Total.Profit);

        if (!regionTotals.hasOwnProperty("Cost")) {
          regionTotals = {
            Cost,
            Revenue,
            Profit,
          };
        } else {
          regionTotals.Cost += Cost;
          regionTotals.Revenue += Revenue;
          regionTotals.Profit += Profit;
        }
      });

      regionsOutput.Regions[regionName].Countries = localRegionOutput;
      regionsOutput.Regions[regionName].Total = regionTotals;
    });

    return regionsOutput;
  },

  getPostProcessingItemTypesCurrency: function(itemTypeTotals){
    Object.entries(itemTypeTotals).forEach(([itemTypeName,itemTypeDetails]) => {
      itemTypeDetails.Revenue = Math.floor(itemTypeDetails.Revenue);
      itemTypeDetails.Cost = Math.floor(itemTypeDetails.Cost);
      itemTypeDetails.Profit = Math.floor(itemTypeDetails.Profit);
    });

    return itemTypeTotals;
  }
}