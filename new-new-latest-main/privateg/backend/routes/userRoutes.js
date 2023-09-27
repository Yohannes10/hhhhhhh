const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const configController = require("../controllers/configController"); // Import the configController

const {
  authenticateUserMiddleware, // Add authentication middleware as needed
} = require("../middleware/middleware");

// GET request to fetch all users
router.get("/all-users", authenticateUserMiddleware, userController.getAllUsers);

// GET request to fetch tasks of a specific user by their user ID (for admin)
router.get("/:userId/tasks", authenticateUserMiddleware, userController.getTasksOfUser);

// GET request to fetch goals assigned to the current user
router.get("/my-goals", authenticateUserMiddleware, userController.getMyGoals);

// Route to get the list of Reviewers
router.get("/reviewers", userController.getReviewers);

// GET request to get the list of departments
router.get("/departments", userController.getAllDepartments);


//// Route to save configuration data
router.post("/configurations", configController.saveConfiguration);

// GET request to fetch configuration data
router.get("/configurations", configController.getConfiguration);

module.exports = router;
