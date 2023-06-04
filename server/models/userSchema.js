var mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  _id: String,
  password: String,
  tasks: [
    {
      task: String,
      completed: Boolean,
      creationTime: String,
      completionTime: String,
    },
  ],
});

module.exports = mongoose.model("USER", userSchema);
