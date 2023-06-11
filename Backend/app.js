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

app.use(function (err, req, res, next) {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: message });
});

var mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.Promise = require("bluebird");
mongoose
  .connect(config.mongodbURL, { useNewUrlParser: true })
  .then(() => console.log("Connection successful"))
  .catch((err) => console.error(err));

module.exports = app;
