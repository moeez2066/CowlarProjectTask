var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var app = express();
var { graphqlHTTP } = require("express-graphql");
var schema = require("./graphql/userSchemaQl");
var cors = require("cors");
var config = require("./config");
require("dotenv").config();
app.use("*", cors());
app.use(
  "/graphql",
  cors(),
  graphqlHTTP({
    schema: schema,
    rootValue: global,
    graphiql: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json({
    error: err.message,
  });
});

var mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.Promise = require("bluebird");
mongoose;
mongoose
  .connect(config.mongodbURL, { useNewUrlParser: true })
  .then(() => console.log("Connection successful"))
  .catch((err) => console.error(err));

module.exports = app;
