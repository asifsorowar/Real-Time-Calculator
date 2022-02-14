const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const calculations = require("../router/calculations");
const errors = require("../middleware/errors");

module.exports = (app) => {
  app.use(express.json());
  app.use(express.static("public"));
  app.use(cors());
  app.use(fileUpload());

  app.use((req, res, next) => {
    setTimeout(() => next(), 2000);
  });
  app.use("/api/calculations", calculations);
  app.use(errors);
};
