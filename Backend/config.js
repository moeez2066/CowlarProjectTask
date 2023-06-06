require("dotenv").config();
module.exports = {
  mongodbURL: process.env.MONGODB_URL,
  port: process.env.PORT,
};
