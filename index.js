const { getDataToBeProcessed } = require("./util");

const { processTransformedData } = require("./taskProcessing");


// This will output three json files in ./files/output/
transformingDataFromStream("./files/node-data-processing-medium-data.csv");

async function transformingDataFromStream(fileName){

// Timing the performance between processes
  let _performanceInitial = new Date().getTime();
  let _performanceFinal = new Date().getTime();
  let _differenceInMillis = 0;

  const results = await getDataToBeProcessed(fileName);

    // Logging the performance of the initial task of converting csv to json
    _performanceFinal = new Date().getTime();
    _differenceInMillis = _performanceFinal - _performanceInitial;
    console.log(
      `Time to parse the csv file -> ${_differenceInMillis / 1000} seconds`
    );



   // Logging the time to transform all 3 parts of the data as a whole
    _performanceInitial = new Date().getTime();
    _performanceFinal = new Date().getTime();
    _differenceInMillis = 0;

  processTransformedData(results);

  _performanceFinal = new Date().getTime();
  _differenceInMillis = _performanceFinal - _performanceInitial;
  console.log(
    `Time to transform all of the 3 tasks -> ${_differenceInMillis / 1000} seconds`
  );

}