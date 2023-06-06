const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  task: String,
  completed: Boolean,
  creationTime: String,
  completionTime: String,
});

const userSchema = new mongoose.Schema({
  _id: String,
  password: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);

module.exports = { User, Task };
