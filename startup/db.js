require("colors");
const mongoose = require("mongoose");

module.exports = () =>
  mongoose
    .connect(process.env.DB)
    .then(() => console.log("mongodb is connected.....".green))
    .catch(() => console.log("could not connected to mongodb.....".red));
