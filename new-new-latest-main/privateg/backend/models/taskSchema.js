const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model to associate the rating with a user
  },
  rating: {
    type: Number,
    min: 0,
    max: 5, // Assuming a 5-star rating system
  },
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    required: true,
  },
  departmentalGoal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DepartmentalObjective", // Reference the DepartmentalObjective model
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ratings: [ratingSchema], // Embed the rating schema within the task schema
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
