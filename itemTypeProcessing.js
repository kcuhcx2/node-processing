module.exports = {
  accumulateGlobalItemTypeCurrency: function(itemTypeTotals,result,Cost,Revenue,Profit){
    if (!itemTypeTotals.hasOwnProperty(result["Item Type"])) {
      itemTypeTotals[result["Item Type"]] = {
        Cost,
        Revenue,
        Profit,
      };
    } else {
      itemTypeTotals[result["Item Type"]].Cost += Cost;
      itemTypeTotals[result["Item Type"]].Revenue += Revenue;
      itemTypeTotals[result["Item Type"]].Profit += Profit;
    }
  
    return itemTypeTotals;
  }
}