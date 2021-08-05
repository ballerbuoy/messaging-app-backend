const fs = require("fs");
const { ERROR_MESSAGES } = require("../constants");

class DB {
  constructor(filepath) {
    this.filePath = filepath;
  }

  readFromDB() {
    return new Promise((resolve, reject) => {
      try {
        const fileData = fs.readFileSync(this.filePath);
        resolve(fileData);
      } catch (err) {
        reject({
          code: 500,
          message: ERROR_MESSAGES[500],
        });
      }
    });
  }

  writeToDB(jsonData) {
    return new Promise((resolve, reject) => {
      try {
        fs.writeFileSync(this.filePath, jsonData);
        resolve("Write Successful");
      } catch (err) {
        reject({
          code: 500,
          message: ERROR_MESSAGES[500],
        });
      }
    });
  }
}

module.exports = { DB };
