module.exports = {
  processAverageShipDataForYearsAndMonths: function(averageTimeToShip,result,orderDate,orderYear,orderMonth){
    const shipDate = new Date(result["Ship Date"]);
    const shipOrdeTimeDiff = shipDate.getTime() - orderDate.getTime();
    const shipOrderDifferenceInDays = Math.ceil(
      shipOrdeTimeDiff / (1000 * 60 * 60 * 24)
    );
    const unitsSold = parseInt(result["Units Sold"]);
    if (!averageTimeToShip[orderYear]) {
      // Adding a new year and month
      averageTimeToShip[orderYear] = {
        [orderMonth]: {
          totalDaysToShip: shipOrderDifferenceInDays,
          AvgDaysToShip: 0,
          timesOrderedWithinMonth: 1,
          NumberOfOrders: unitsSold,
        },
      };
    } else {
      // Check if month already exists
      if (!averageTimeToShip[orderYear].hasOwnProperty(orderMonth)) {
        averageTimeToShip[orderYear][orderMonth] = {
          totalDaysToShip: shipOrderDifferenceInDays,
          AvgDaysToShip: 0,
          timesOrderedWithinMonth: 1,
          NumberOfOrders: unitsSold,
        };
      } else {
        // We add to the existing average days to ship
        averageTimeToShip[orderYear][
          orderMonth
        ].totalDaysToShip += shipOrderDifferenceInDays;
        averageTimeToShip[orderYear][orderMonth].timesOrderedWithinMonth += 1;
        averageTimeToShip[orderYear][orderMonth].NumberOfOrders += unitsSold;
      }
    }

    // get Regions avg days within date range
    // Check if it has the regions property within the year / month
    if (!averageTimeToShip[orderYear][orderMonth].hasOwnProperty("Regions")) {
      averageTimeToShip[orderYear][orderMonth].Regions = {};
    } else if (
      !averageTimeToShip[orderYear][orderMonth].Regions.hasOwnProperty([
        result.Region,
      ])
    ) {
      averageTimeToShip[orderYear][orderMonth].Regions[result.Region] = {
          totalDaysToShip: shipOrderDifferenceInDays,
          AvgDaysToShip: 0,
          timesOrderedWithinMonth: 1,
          NumberOfOrders: unitsSold,
          Countries: {},
      };
    } else {
      // update unitsSold and shipOrderDifference for regions
      let averageShipTimeRegion = averageTimeToShip[orderYear][orderMonth].Regions[result.Region];

      averageShipTimeRegion.totalDaysToShip += shipOrderDifferenceInDays;
      averageShipTimeRegion.timesOrderedWithinMonth += 1;
      averageShipTimeRegion.NumberOfOrders += unitsSold;

      if (!averageShipTimeRegion.Countries.hasOwnProperty(result.Country)) {
        averageShipTimeRegion.Countries[result.Country] = {
            totalDaysToShip: shipOrderDifferenceInDays,
            AvgDaysToShip: 0,
            timesOrderedWithinMonth: 1,
            NumberOfOrders: unitsSold,
        };
      } else {
        averageShipTimeRegion.Countries[result.Country].totalDaysToShip += shipOrderDifferenceInDays;
        averageShipTimeRegion.Countries[result.Country].timesOrderedWithinMonth += 1;
        averageShipTimeRegion.Countries[result.Country].NumberOfOrders += unitsSold;
      }
    }
    return averageTimeToShip;
  }
}