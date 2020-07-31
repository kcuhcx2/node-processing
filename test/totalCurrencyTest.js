var expect = require("chai").expect;
const { accumulateOrderPriorities } = require("../orderPriorities");

describe("Passing in a row of json data for accumulated priorities", function () {
  it("return the expected outcome ", function () {
    const result = {
      Region: "Sub-Saharan Africa",
      Country: "South Africa",
      "Item Type": "Fruits",
      "Sales Channel": "Offline",
      "Order Priority": "M",
      "Order Date": "7/27/2012",
      "Order ID": "443368995",
      "Ship Date": "7/28/2012",
      "Units Sold": "1593",
      "Unit Price": "9.33",
      "Unit Cost": "6.92",
      "Total Revenue": "14862.69",
      "Total Cost": "11023.56",
      "Total Profit": "3839.13",
    };

    const priorities = accumulateOrderPriorities({}, result, 2012, 7);

    expect([priorities]).to.have.deep.members([
      { "2012": { "7": { L: 0, H: 0, C: 0, M: 1 } } },
    ]);
  });
  it("Should return expected outcome", function () {
    const result1 = {
      Region: "Middle East and North Africa",
      Country: "Morocco",
      "Item Type": "Clothes",
      "Sales Channel": "Online",
      "Order Priority": "M",
      "Order Date": "9/14/2013",
      "Order ID": "667593514",
      "Ship Date": "10/19/2013",
      "Units Sold": "4611",
      "Unit Price": "109.28",
      "Unit Cost": "35.84",
      "Total Revenue": "503890.08",
      "Total Cost": "165258.24",
      "Total Profit": "338631.84",
    };

    const priorities = accumulateOrderPriorities({}, result1, 2013, 9);

    expect([priorities]).to.have.deep.members([
      { "2013": { "9": { L: 0, H: 0, C: 0, M: 1 } } },
    ]);
  });
});
