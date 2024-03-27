const mongoose = require("mongoose");
const connectString = process.env.DB_URL;
class Database {
  constructor() {
    this.connect();
  }
  connect() {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then(() => {
        console.log("Database is connected");
      })
      .catch((error) => {
        console.log("Database is not connected");
      });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
