const rateLimit = require("express-rate-limit");
module.exports = () => {
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 mins
    max: 10,
  });

  return limiter;
};
