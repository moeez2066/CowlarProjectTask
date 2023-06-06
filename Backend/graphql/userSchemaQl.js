const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
} = require("graphql");
const { User, Task } = require("../models/userSchema");
const mongoose = require("mongoose");
const taskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    _id: { type: GraphQLString },
    task: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    creationTime: { type: GraphQLString },
    completionTime: { type: GraphQLString },
  }),
});

const taskInputType = new GraphQLInputObjectType({
  name: "TaskInput",
  fields: () => ({
    task: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    creationTime: { type: GraphQLString },
    completionTime: { type: GraphQLString },
  }),
});

const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLString },
    password: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(taskType),
      resolve: (user) => Task.find({ _id: { $in: user.tasks } }),
    },
  }),
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    Allusers: {
      type: new GraphQLList(userType),
      resolve: () => User.find().exec(),
    },
    Oneuser: {
      type: userType,
      args: {
        id: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: (_, { id, password }) =>
        User.findOne({ _id: id, password }).exec(),
    },
    taskUser: {
      type: userType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: (_, { id }) => User.findOne({ _id: id }).exec(),
    },
  }),
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addUser: {
      type: userType,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { _id, password }) => {
        const newUser = new User({ _id, password });
        try {
          const savedUser = await newUser.save();
          return savedUser;
        } catch (err) {
          if (err.code === 11000) {
            throw new Error("User already exists");
          } else {
            throw new Error("Error");
          }
        }
      },
    },
    updateUser: {
      type: userType,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLString) },
        task: { type: taskInputType },
      },
      resolve: async (_, { _id, task }) => {
        try {
          const user = await User.findById(_id);
          if (!user) {
            throw new Error("User not found");
          }

          const newTask = new Task({
            _id: new mongoose.Types.ObjectId(),
            task: task.task,
            completed: false,
            creationTime:
              new Date().toLocaleDateString() +
              " " +
              new Date().toLocaleTimeString(),
            completionTime: task.completionTime,
          });

          await newTask.save();
          user.tasks.push(newTask._id);
          await user.save();
          const updatedUser = await User.findById(_id);
          return updatedUser;
        } catch (err) {
          throw new Error(err.message);
        }
      },
    },
    updateTaskCompletion: {
      type: userType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        taskId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, { userId, taskId }) => {
        try {
          const user = await User.findById(userId);
          if (!user) {
            throw new Error("User not found");
          }
          if (taskId < 0 || taskId >= user.tasks.length) {
            throw new Error("Invalid task index");
          }
          const taskToUpdateId = user.tasks[taskId];
          if (!taskToUpdateId) {
            throw new Error("Task not found");
          }
          const updatedTask = await Task.findByIdAndUpdate(
            taskToUpdateId,
            {
              completed: true,
              completionTime:
                new Date().toLocaleDateString() +
                " " +
                new Date().toLocaleTimeString(),
            },
            { new: true }
          );
          user.tasks[taskId] = updatedTask._id;
          const updatedUser = await user.save();

          return updatedUser;
        } catch (err) {
          throw new Error(err.message);
        }
      },
    },

    removeTask: {
      type: userType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        taskId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, { userId, taskId }) => {
        try {
          const user = await User.findById(userId);
          if (!user) {
            throw new Error("User not found");
          }
          if (taskId < 0 || taskId >= user.tasks.length) {
            throw new Error("Invalid task index");
          }
          const taskToRemoveId = user.tasks[taskId];
          user.tasks.splice(taskId, 1);
          const updatedUser = await user.save();
          await Task.findByIdAndDelete(taskToRemoveId);
          return updatedUser;
        } catch (err) {
          throw new Error(err.message);
        }
      },
    },
  }),
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
