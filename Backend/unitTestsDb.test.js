const mongoose = require("mongoose");
const { User } = require("./models/userSchema");
const { Task } = require("./models/userSchema");

describe("Tests", () => {
  beforeAll(async () => {
    mongoose
      .connect("mongodb://0.0.0.0:27017/test-db", { useNewUrlParser: true })
      .then(() => console.log("Connection successful"))
      .catch((err) => console.error(err));
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
  });

  test("Creates a new user successfully", async () => {
    const newUser = new User({
      _id: "unique_id",
      password: "password123",
      tasks: [],
    });

    const createdUser = await newUser.save();
    const foundUser = await User.findById(createdUser._id);
    expect(foundUser).toBeTruthy();
  });

  test("Throws an error when creating a user with an existing ID", async () => {
    const existingUser = new User({
      _id: "existing_id",
      password: "password123",
      tasks: [],
    });

    await existingUser.save();
    const duplicateUser = new User({
      _id: "existing_id",
      password: "password456",
      tasks: [],
    });
    await expect(duplicateUser.save()).rejects.toThrow();
  });

  test("Fetches all users successfully", async () => {
    const users = [
      {
        _id: "user1",
        password: "password1",
        tasks: [],
      },
      {
        _id: "user2",
        password: "password2",
        tasks: [],
      },
    ];

    await User.insertMany(users);

    const fetchedUsers = await User.find({});
    expect(fetchedUsers.length).toEqual(users.length);

    const fetchedUserIds = fetchedUsers.map((user) => user._id.toString());
    const expectedUserIds = users.map((user) => user._id);
    expect(fetchedUserIds).toEqual(expectedUserIds);
  });
  test("Fetches a single user successfully based on ID and password", async () => {
    const existingUser = new User({
      _id: "user1",
      password: "password123",
      tasks: [],
    });

    await existingUser.save();

    const fetchedUser = await User.findOne({
      _id: "user1",
      password: "password123",
    });
    expect(fetchedUser).toBeTruthy();
  });
  test("Throws an error when fetching a user with incorrect credentials", async () => {
    const existingUser = new User({
      _id: "user1",
      password: "password123",
      tasks: [],
    });
    await existingUser.save();
    const incorrectCredentials = {
      _id: "user1",
      password: "incorrectPassword",
    };
    try {
      await User.findOne(incorrectCredentials);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe("Invalid credentials");
    }
  });

  test("Fetches a user's tasks successfully", async () => {
    const user = new User({
      _id: "user1",
      password: "password123",
      tasks: [],
    });
    await user.save();
    const task1 = new Task({
      _id: new mongoose.Types.ObjectId(),
      task: "Task 1",
      completed: false,
      creationTime: new Date(),
      completionTime: null,
    });
    const task2 = new Task({
      _id: new mongoose.Types.ObjectId(),
      task: "Task 2",
      completed: true,
      creationTime: new Date(),
      completionTime: new Date(),
    });
    await Task.insertMany([task1, task2]);
    user.tasks = [task1._id, task2._id];
    await user.save();
    const fetchedUser = await User.findById("user1").populate("tasks");
    const fetchedTasks = fetchedUser.tasks.map((task) => ({
      title: task.task,
      completed: task.completed,
    }));
    const expectedTasks = [
      { title: "Task 1", completed: false },
      { title: "Task 2", completed: true },
    ];
    expect(fetchedTasks).toEqual(expectedTasks);
  });

  test("Adds a task to a user's task list successfully", async () => {
    const newUser = new User({
      _id: "user1",
      password: "password123",
      tasks: [],
    });
    const savedUser = await newUser.save();
    const newTask = new Task({
      _id: mongoose.Types.ObjectId(),
      task: "New Task",
      completed: false,
      creationTime: new Date(),
      completionTime: null,
    });
    savedUser.tasks.push(newTask._id);
    await savedUser.save();
    const fetchedUser = await User.findById(savedUser._id);
    expect(fetchedUser.tasks[0]).toEqual(newTask._id);
  });

  test("Removes a task from a user's task list successfully", async () => {
    const newUser = new User({
      _id: "user1",
      password: "password123",
      tasks: [],
    });
    const savedUser = await newUser.save();
    const newTask = new Task({
      _id: mongoose.Types.ObjectId(),
      task: "New Task",
      completed: false,
      creationTime: new Date(),
      completionTime: null,
    });
    savedUser.tasks.push(newTask);
    await savedUser.save();
    const fetchedUser = await User.findById(savedUser._id);
    const taskIndexToRemove = fetchedUser.tasks.findIndex((task) =>
      task._id.equals(newTask._id)
    );
    fetchedUser.tasks.splice(taskIndexToRemove, 1);
    const updatedUser = await fetchedUser.save();
    const userAfterRemoval = await User.findById(updatedUser._id);
    const removedTask = userAfterRemoval.tasks.find((task) =>
      task._id.equals(newTask._id)
    );
    expect(removedTask).toBeUndefined();
  });

  test("Updates a task's completion status successfully", async () => {
    const newTask = new Task({
      _id: mongoose.Types.ObjectId(),
      task: "New Task",
      completed: false,
      creationTime: new Date(),
      completionTime: null,
    });
    const savedTask = await newTask.save();
    savedTask.completed = true;
    const updatedTask = await savedTask.save();
    expect(updatedTask.completed).toBe(true);
  });
});
