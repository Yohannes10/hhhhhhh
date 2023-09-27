const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model to associate the rating with a user
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task", // Reference the Task model to associate the rating with a task
  },
  rating: {
    type: Number,
    min: 0,
    max: 5, // Assuming a 5-star rating system
    required: true, // Make sure the rating is required
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
