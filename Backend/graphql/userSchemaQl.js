var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLNonNull = require("graphql").GraphQLNonNull;
var GraphQLString = require("graphql").GraphQLString;
var GraphQLInt = require("graphql").GraphQLInt;
var USERModel = require("../models/userSchema");
const { GraphQLBoolean } = require("graphql");
const { GraphQLInputObjectType } = require("graphql");

const taskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
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
    tasks: { type: new GraphQLList(taskType) },
  }),
});

// QUERIES

var queryType = new GraphQLObjectType({
  name: "Query",
  fields: function () {
    return {
      Allusers: {
        type: new GraphQLList(userType),
        resolve: function () {
          const users = USERModel.find().exec();
          if (!users) {
            throw new Error("Error");
          }
          return users;
        },
      },

      Oneuser: {
        type: userType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString,
          },
          password: {
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const userDetails = USERModel.findOne({
            _id: params.id,
            password: params.password,
          }).exec();

          if (!userDetails) {
            throw new Error("Error");
          }
          return userDetails;
        },
      },

      taskUser: {
        type: userType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const userDetails = USERModel.findOne({
            _id: params.id,
          }).exec();

          if (!userDetails) {
            throw new Error("Error");
          }
          return userDetails;
        },
      },
    };
  },
});

// MUTATIONS

var mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function () {
    return {
      addUser: {
        type: userType,
        args: {
          _id: {
            type: new GraphQLNonNull(GraphQLString),
          },
          password: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: async function (root, params) {
          const usr = new USERModel(params);
          try {
            const newUsr = await usr.save();
            return newUsr;
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
          tasks: { type: new GraphQLList(taskInputType) },
        },
        resolve: async function (root, { _id, tasks }) {
          try {
            const user = await USERModel.findById(_id);
            if (!user) {
              throw new Error("User not found");
            }
            const updatedTasks = tasks.map((taskInput) => ({
              task: taskInput.task,
              completed: taskInput.completed,
              creationTime: taskInput.creationTime,
              completionTime: taskInput.completionTime,
            }));
            user.tasks.push(...updatedTasks);
            const updatedUser = await user.save();

            return updatedUser;
          } catch (err) {
            throw new Error(err.message);
          }
        },
      },
      updateTaskCompletion: {
        type: userType,
        args: {
          _id: { type: new GraphQLNonNull(GraphQLString) },
          taskIndex: { type: new GraphQLNonNull(GraphQLInt) },
          completionTime: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async function (root, { _id, taskIndex, completionTime }) {
          try {
            const user = await USERModel.findById(_id);
            if (!user) {
              throw new Error("User not found");
            }
            user.tasks[taskIndex].completed = true;
            user.tasks[taskIndex].completionTime = completionTime;
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
          _id: { type: new GraphQLNonNull(GraphQLString) },
          taskIndex: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve: async function (root, { _id, taskIndex }) {
          try {
            const user = await USERModel.findById(_id);

            if (!user) {
              throw new Error("User not found");
            }
            user.tasks.splice(taskIndex, 1);
            const updatedUser = await user.save();
            return updatedUser;
          } catch (err) {
            throw new Error(err.message);
          }
        },
      },
    };
  },
});
module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
