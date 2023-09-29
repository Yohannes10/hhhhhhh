const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const Task = require("../models/taskSchema");
const Department = require("../models/departmentModel"); // Import the Department model

 


// Register a user
exports.register = async (req, res) => {
  // get data from request body
  const { username, password, email } = req.body;

  // try-catch block
  try {
    // checks if username exists already
    const existingUser = await User.findOne({ username });

    // send back the res
    if (existingUser) {
      return res.status(409).json({ message: "Usern already exists" });
    }

    // unique username -> user is created & saved
    const newUser = new User({ username, password, email, privilege: "Read" });
    await newUser.save();

    // send success message
    res.json({ message: "User registered successfully" });
  } catch (err) {
    // log the error for debugging
    console.error("Error registering user:", err);
    // send error message
    res.status(500).json({ message: "Failed to register user" });
  }
};

// Login a user
exports.login = async (req, res) => {
  // get data from request body
  const { username, password } = req.body;

  // try-catch block
  try {
    // searches for the user
    const user = await User.findOne({ username, password });

    // if user is not found
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // JWT token is generated using the user's ID and secret key
    const token = jwt.sign({ userId: user._id, role: user.role }, "secretKey");

    // send token
    res.json({ token });
  } catch (err) {
    // log the error for debugging
    console.error("Error logging in:", err);
    // send error message
    res.status(500).json({ message: "Failed to log in" });
  }
};

// Change password for a user
exports.changePassword = async (req, res) => {
  // get data from request body
  const { username, currentPassword, newPassword } = req.body;

  // try-catch block
  try {
    // Find the user by username and current password
    const user = await User.findOne({ username, password: currentPassword });

    // If user is not found or current password is incorrect
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Update the user's password with the new password
    user.password = newPassword;
    await user.save();
    // send success message
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    // log the error for debugging
    console.error("Error changing password:", err);
    // send error message
    res.status(500).json({ message: "Failed to change password" });
  }
};


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Only allow admin users to retrieve all users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to retrieve all users" });
    }

    const users = await User.find();

    // Check if any users were found
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
      console.log("Testing")
    }

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);

    // Check if the error is a MongoDB-related error (e.g., database connection issues)
    if (err.name === 'MongoError') {
      return res.status(500).json({ message: "Database error" });
    }

    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getTasksOfUser = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to retrieve another user's tasks" });
    }

    const { userId } = req.params;

    // Find tasks associated with the specified user ID
    const userTasks = await Task.find({ user: userId });

    res.json(userTasks);
  } catch (err) {
    console.error("Error fetching user's tasks:", err);
    res.status(500).json({ message: "Failed to fetch user's tasks" });
  }
};


// Get goals assigned to the current user
exports.getMyGoals = async (req, res) => {
  try {
    // Get the ID of the currently authenticated user
    const currentUserId = req.user.userId;

    // Find goals assigned to the current user
    const userGoals = await Task.find({ user: currentUserId });

    res.json(userGoals);
  } catch (err) {
    console.error("Error fetching user's goals:", err);
    res.status(500).json({ message: "Failed to fetch user's goals" });
  }
};

// Get the list of Reviewers
exports.getReviewers = async (req, res) => {
  try {
    // Find users who have the role "admin"
    const reviewers = await User.find({ role: 'admin' });

    // Extract the usernames of the admins to use as Reviewers
    const reviewerUsernames = reviewers.map((reviewer) => reviewer.username);

    res.json(reviewerUsernames);
  } catch (err) {
    console.error("Error fetching Reviewers:", err);
    res.status(500).json({ message: "Failed to fetch Reviewers" });
  }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();

    // Check if any departments were found
    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }

    res.json(departments);
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};
