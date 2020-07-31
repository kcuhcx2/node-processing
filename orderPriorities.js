module.exports = {
  accumulateOrderPriorities: function(priorityOrdersForMonths,result,orderYear,orderMonth){
    const orderPriority = result["Order Priority"].toUpperCase().trim();
    if (!priorityOrdersForMonths.hasOwnProperty(orderYear)) {
      // adding a new year / new month
      priorityOrdersForMonths[orderYear] = {
        [orderMonth]: {
          L: orderPriority === "L" ? 1 : 0,
          H: orderPriority === "H" ? 1 : 0,
          C: orderPriority === "C" ? 1 : 0,
          M: orderPriority === "M" ? 1 : 0,
        },
      };
    } else {
      // Check if month already exists
      if (!priorityOrdersForMonths[orderYear].hasOwnProperty(orderMonth)) {
        priorityOrdersForMonths[orderYear][orderMonth] = {
          L: orderPriority === "L" ? 1 : 0,
          H: orderPriority === "H" ? 1 : 0,
          C: orderPriority === "C" ? 1 : 0,
          M: orderPriority === "M" ? 1 : 0,
        };
      } else {
        // We increment the existing priority order
        priorityOrdersForMonths[orderYear][orderMonth].L +=
          orderPriority === "L" ? 1 : 0;
        priorityOrdersForMonths[orderYear][orderMonth].H +=
          orderPriority === "H" ? 1 : 0;
        priorityOrdersForMonths[orderYear][orderMonth].C +=
          orderPriority === "C" ? 1 : 0;
        priorityOrdersForMonths[orderYear][orderMonth].M +=
          orderPriority === "M" ? 1 : 0;

      }
    }
  
    return priorityOrdersForMonths;
  }
}