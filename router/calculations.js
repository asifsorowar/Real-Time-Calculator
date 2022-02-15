const express = require("express");
const path = require("path");
const limiter = require("../middleware/limiter");

const router = express.Router();
const { Calculation } = require("../model/Calculation");

router.get("/", async (req, res) => {
  const calculations = await Calculation.find({ result: { $ne: "" } })
    .sort("-created")
    .skip(req.query.offset)
    .limit(req.query.limit);

  return res.status(200).send(calculations);
});

router.post("/", limiter(), async (req, res) => {
  const file = req.files?.file;
  const title = req.body?.title;
  if (!title) return res.status(400).send("title is required!");
  let calculation;

  if (file) {
    if (!file.mimetype.startsWith("text/plain"))
      return res.status(400).send("Only text file is allowed!");

    if (file.size > process.env.FILE_SIZE)
      return res
        .status(400)
        .send(`File must be less then ${process.env.FILE_SIZE} byte`);
    file.name = `txt_${Date.now()}${path.parse(file.name).ext}`;

    let filePath = `${path.parse(__dirname).dir}${
      process.env.FILE_UPLOAD_PATH
    }/${file.name}`;

    let text = file.data.toString().replace(/\s+/gi, "");
    calculation = new Calculation({
      title,
      text,
      created: Date.now(),
    });
    await calculation.save();

    await file.mv(filePath);

    let fileName = file.name;
    calculation = await Calculation.findByIdAndUpdate(
      calculation._id,
      {
        file: fileName,
      },
      { new: true }
    );

    let result = calculateResult(text);

    if (!result) return res.status(400).send("Invalid text format!");

    calculation = await Calculation.findByIdAndUpdate(
      calculation._id,
      {
        result,
      },
      { new: true }
    );
  } else {
    calculation = new Calculation({
      title,
      created: Date.now(),
    });
    await calculation.save();
  }

  return res.status(200).send(calculation);
});

module.exports = router;

const syncWait = (ms) => {
  const end = Date.now() + ms;
  while (Date.now() < end) continue;
};

const calculateResult = (text) => {
  let validation = text.match(
    /^\*|^\/|\.{2,}|[\*\/\%]{2,}|[\+\-]{3,}|[^\d|\.|\+|\-|\*|\/|\%]+|[\+\-\*\/\%]$/gi
  );
  if (validation?.length > 0) return null;

  syncWait(13000);

  text = text.replace(/\+\-|\-\+|\-\-+/gi, "-");
  text = text.replace(/\+\++/gi, "+");

  let sign;
  let left = 0;
  let i = 0;
  let result = 0;
  while (i <= text.length) {
    if (
      text[i] === "+" ||
      text[i] === "-" ||
      text[i] === "*" ||
      text[i] === "/" ||
      text[i] === "%"
    ) {
      let value = parseFloat(text.substring(left, i));
      if (result === 0 && !sign) {
        if (i != 0) result = value;
        sign = text[i];
      } else {
        if (sign === "+") result += value;
        else if (sign === "-") result -= value;
        else if (sign === "*") result *= value;
        else if (sign === "/") result /= value;
        else if (sign === "%") result %= value;
        else null;
      }

      sign = text[i];
      left = i + 1;
      i++;
    }

    if (i === text.length) {
      let value = parseFloat(text.substring(left, i));
      if (sign === "+") result += value;
      else if (sign === "-") result -= value;
      else if (sign === "*") result *= value;
      else if (sign === "/") result /= value;
      else if (sign === "%") result %= value;
      else null;
    }

    i++;
  }

  return result.toFixed(3);
};
