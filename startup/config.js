module.exports = () => {
  require("colors");
  require("express-async-errors");
  require("dotenv").config({ path: "./config/config.env" });
};
