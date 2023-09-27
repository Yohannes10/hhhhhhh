const Task = require("../models/taskSchema")
const DepartmentalObjective = require("../models/DepartmentalObjectiveSchema");
const Rating = require("../models/ratingSchema");
const User =require("../models/userSchema")




// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    // retrieves all tasks associated with the authenticated user
    const tasks = await Task.find({ user: req.user._id });
    // queries the model and returns an array of the task objects
    res.json(tasks);
  } catch (err) {
    // log the error for debugging
    console.error("Error fetching tasks:", err);
    // sends error message
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};


exports.getAllDepartmentalGoals = async (req, res) => {
  try {
    const departmentalGoals = await DepartmentalObjective.find();
    res.json(departmentalGoals);
  } catch (err) {
    console.error("Error fetching departmental goals:", err);
    res.status(500).json({ message: "Failed to fetch departmental goals" });
  }
};


// Create a task
exports.createTask = async (req, res) => {
  try {
    // task title must be in the body
    const { title, description, date } = req.body;

    // log the received request body for debugging
    console.log("Received Request Body:", req.body);
        

    
    // Check if the title field is not empty
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: "Task title is required." });
    }
    // creates a new instance of the model with the title and authenticated user's ID
    const task = new Task({
      title,
      description,
      date,
      user: req.user._id,
    });

    // log the task data before saving for debugging
    console.log("Task Data to be Saved:", task);

    // saved to database
    await task.save();

    // log the saved task for debugging
    console.log("Saved Task:", task);

    // send the created task
    res.status(201).json(task);
  } catch (err) {
    // log the error for debugging
    console.error("Error creating task:", err);
    // sends error message
    res.status(500).json({ message: "Failed to create task" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    // task ID is specified in the request parameters
    const { id } = req.params;
    const { title, description, date, completed } = req.body; // Make sure to include these fields

    // finds the task and edits it to the new title
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, date, completed }, // Use all the received fields
      { new: true }
    );

    // if the task is not found send error message
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // send the updated task
    res.json(updatedTask);
  } catch (err) {
    // log the error for debugging
    console.error("Error updating task:", err);
    // sends error message
    res.status(500).json({ message: "Failed to update task" });
  }
};


// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    // task ID (id) is specified in the request parameters
    const { id } = req.params;

    // removes by id
    const deletedTask = await Task.findByIdAndRemove(id);

    // if the task is not found send error message
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // send No Content status code -> indicates that the server has successfully processed the request but there is no content to send back in the response payload
    res.sendStatus(204);
  } catch (err) {
    // log the error for debugging
    console.error("Error deleting task:", err);
    // sends error message
    res.status(500).json({ message: "Failed to delete task" });
  }
};

// Toggle a task to true of false
exports.toggleTask = async (req, res) => {
  try {
    // task ID (id) is specified in the request parameters
    const { id } = req.params;
    const { completed } = req.body;

    // finds by id and toggles the false to true and vice versa
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed }, // Only update the 'completed' field not the title
      { new: true }
    );

    // if the task is not found send error message
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // send the toggles task
    res.json(updatedTask);
  } catch (err) {
    // log the error for debugging
    console.error("Error toggling task:", err);
    // sends error message
    res.status(500).json({ message: "Failed to toggle task" });
  }
};

exports.getGoalsOfUser = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to retrieve another user's goals" });
    }

    const { userId } = req.params;

    // Find goals associated with the specified user ID
    const userGoals = await Task.find({ user: userId });

    res.json(userGoals);
  } catch (err) {
    console.error("Error fetching user's goals:", err);
    res.status(500).json({ message: "Failed to fetch user's goals" });
  }
};


// Create a rating
exports.addRating = async (req, res) => {
  try {
    // Extract rating data from the request body
    const { taskId, rating } = req.body;
   
    // Log the received data for debugging
    console.log("Received Rating Data:", { taskId, rating });

    // Create a new rating instance
    const newRating = new Rating({
      taskId,
      rating,
      userId: req.user._id, // Assuming you have user authentication in place
    });

    // Save the new rating to the database
    await newRating.save();

    // Respond with a success message
    res.status(201).json({ message: "Rating added successfully" });
  } catch (error) {
    // Handle errors and respond with an error message
    console.error("Error adding rating:", error);
    res.status(500).json({ message: "Failed to add rating" });
  }
};



// Assign a new task to a user
exports.assignTaskToUser = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to assign tasks to users" });
    }

    const { userId, task } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new task with the provided details
    const newTask = new Task(task);

    // Save the new task to the database
    await newTask.save();

    // Assign the new task to the user
    user.tasks.push(newTask);
    await user.save();

    res.status(201).json({ message: "New task assigned to user successfully", task: newTask });
  } catch (err) {
    console.error("Error assigning task to user:", err);
    res.status(500).json({ message: "Failed to assign task to user" });
  }
};
