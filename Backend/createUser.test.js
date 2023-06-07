const mongoose = require("mongoose");
const { User } = require("./models/userSchema");

describe("User Creation", () => {
  beforeAll(async () => {
    mongoose
      .connect("mongodb://0.0.0.0:27017/test-db", { useNewUrlParser: true })
      .then(() => console.log("Connection successful"))
      .catch((err) => console.error(err));
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
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
});


