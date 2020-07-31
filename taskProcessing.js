const { getMonth, writeToFile } = require("./util");
const { getPostProccessingCurrencyRoundingForRegions, getPostProcessingItemTypesCurrency, postProcessingCountriesWithinRegions, getPostProccessingCurrencyRoundingForTimeAvg} = require("./postProcessing");
const { accumulateOrderPriorities } = require("./orderPriorities");
const { processAverageShipDataForYearsAndMonths } = require("./averageShipDataProcessing");
const { accumulateGlobalItemTypeCurrency } = require("./itemTypeProcessing");
const { accumulateCountryCurrencyData } = require("./countryProcessing");

module.exports = {
  processTransformedData: function(results){

    // Initialising the main variables for the three tasks
    let countryCurrencyData = {};
    let regionData = {};
    let itemTypeTotals = {};
    let priorityOrdersForMonths = {};
    let averageTimeToShip = {};
    let regionsOutput = {
      Regions: {}
    };

  
    results.forEach((result) => {
      // Find all of the country keys for each region
      if (!regionData[result.Region]) {
        regionData[result.Region] = new Set([result.Country]);
      } else {
        regionData[result.Region].add(result.Country);
      }
  
      const Cost = parseFloat(result["Unit Cost"]);
      const Revenue = parseFloat(result["Total Revenue"]);
      const Profit = parseFloat(result["Total Profit"]);
  
      // Process country data
      // We construct the country objects with all the costs inside of them
      countryCurrencyData = accumulateCountryCurrencyData(countryCurrencyData,result,Cost,Revenue,Profit);
  
  
      // Keeping track of every item type purchase to have a global output for all of the regions combined
      itemTypeTotals = accumulateGlobalItemTypeCurrency(itemTypeTotals,result,Cost,Revenue,Profit);
  
      // Adding years and months for the priority orders
      const orderDate = new Date(result["Order Date"]);
      const orderYear = orderDate.getFullYear().toString();
      const orderMonth = getMonth(orderDate);
  
      // Getting the priority orders
      priorityOrdersForMonths = accumulateOrderPriorities(priorityOrdersForMonths,result,orderYear,orderMonth);
  
  
      // Average ship time
  
      // Add together all of the day difference between shipDate and orderDate - they will be averaged as part of the post processing
      averageTimeToShip = processAverageShipDataForYearsAndMonths(averageTimeToShip,result,orderDate,orderYear,orderMonth);
    });
  
    // Post processing the current data we have
    // Tidys up some of the currency data along with assigning countries to a region
    // We only want to go through the initial results once
    // This will only go over pre existing objects creating during that process
    averageTimeToShip = getPostProccessingCurrencyRoundingForTimeAvg(averageTimeToShip);
  
    // Post processing - iterate through regions
    regionsOutput = postProcessingCountriesWithinRegions(regionData,regionsOutput,countryCurrencyData);
  
    // Tidying up currency costs - removing any decimals on total Costs / Profits / Revenue
    // Direct regions costs
    regionsOutput = getPostProccessingCurrencyRoundingForRegions(regionsOutput);
  
    // Tidying up global item types
    itemTypeTotals = getPostProcessingItemTypesCurrency(itemTypeTotals)
  
    // Adding the global item types for all of the regions collectively
    regionsOutput["ItemTypes"] = itemTypeTotals;
  
    // Writing the output for the respective tasks to each file
    // Task #1
    writeToFile(
      "./files/output/totalProfitRevenueCostForRegion.json",
      JSON.stringify(regionsOutput)
    );
    // Task #2
    writeToFile(
      "./files/output/monthlyPriorityOrder.json",
      JSON.stringify(priorityOrdersForMonths)
    );
    // Task #3
    writeToFile("./files/output/averageTimeToShip.json", JSON.stringify(averageTimeToShip));
  
  }
}