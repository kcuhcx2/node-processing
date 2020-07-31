const fs = require("fs");
const csv = require("csv-parser");

module.exports = {
  getMonth: function (date) {
    var month = date.getMonth() + 1;
    return month < 10 ? "0" + month : "" + month;
  },

  writeToFile: function(targetFile,data){
    fs.writeFileSync(
      targetFile,
      data
    );
  },

  getDataToBeProcessed: async function(filename){
    const results = [];
    return new Promise((resolve) => {
      fs.createReadStream(filename)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      });
    });
  }
};

