import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import TaskList from "./TaskList";
import Login from "../Authentication/Login";
import Register from "../Authentication/Register";
import Add from "./Add";
import Edit from "./Edit";
import "../Extra/Navbar.css";
import Home from "./Home";
import Help from "../Extra/Help";
import { Route, BrowserRouter as Router, Routes, navigate } from "react-router-dom";
import Sidebar from "../Extra/Sidebar";
import RatingSummary from "../Extra/RatingSummary";
import EmpGoals from "../Admin/EmpGoals";
import Team from "../Admin/Team";
import "./ParentComponent.css";
import { fetchAllUsers, fetchUserTasks } from "../Admin/fetchUsers";
import Welcome from "../Authentication/Welcome";
import { useNavigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";


// ParentComponent: Manages user authentication, task handling, and UI rendering
const ParentComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [pendingDeletions, setPendingDeletions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(""); // Replace with your selectedUser state

  const checkAdminStatus = () => {
    // Retrieve the user's role from wherever you have it (e.g., from the server response)
    const userRole = localStorage.getItem("userRole"); // Replace with your actual role retrieval logic
  
    // Check if the user has admin role
    if (userRole === "admin") {
      setIsAdmin(true);
    }
  };
  
  useEffect(() => {
    // Function to check if the user is registered
    const checkRegistrationStatus = () => {
      const token = localStorage.getItem("token");
      setIsAdmin(!!token);
  
      // Check user's role (call checkAdminStatus here or wherever you have access to role info)
      checkAdminStatus();
    };
  
    checkRegistrationStatus();
  }, []);
  

  // asynchronous function that handles the adding of tasks - has one parameter
  const addTask = async (taskContent) => {
    try {
      // get token
      const token = localStorage.getItem("token");

      // sends POST request to APT with token and task in the request body
      const response = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskContent.title,
          description: taskContent.description,
          date: taskContent.date,
          departmentalGoal: taskContent.departmentalGoal,
        }),
      });
      // handle different response status codes
      if (response.status === 400) {
        alert("Task exceeds 140 character limit!");
      } else if (response.status === 415) {
        alert("Input is not JSON content!");
      } else if (response.status === 500) {
        alert("Error adding task");
      }
      // if the response was ok
      if (response.ok) {
        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);
        toast.success("Task added successfully!");
      } else {
        throw new Error("Error adding task");
      }
    } catch (error) {
      // Display the error message using toast
      toast.error("Error adding task: " + error.message);
      console.error("Error adding task:", error);
    }
  };

  const someFunction = async () => {
    try {
      const token = localStorage.getItem("token");
      const users = await fetchAllUsers(token); // Pass the token as an argument
      // Handle the fetched users data
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // asynchronous function that handles the registration submission - has two parameters
  const handleRegister = async (username, password, email, confirmPassword) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please confirm your password.");
      return;
    }
    try {
      // sends a POST request to the API with the username and password in the body request
      const response = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      // if the response was OK
      if (response.status === 200) {
        // alert the user
        // Update the state to indicate successful registration
        setIsRegistered(true);
        toast.success("User registered successfully.");
        navigate("/login"); // Change "/login" to the actual path of your login page
        // if the response was a Bad Request
      } else if (response.status === 400) {
        const data = await response.json();
        // log  the error
        console.log("Registration failed:", data.error);
        // alert the user
        alert("Registration failed!");
        // if the response code was Forbidden
      } else if (response.status === 403) {
        // log  the error
        console.log("Registration forbidden: User not allowed.");
        // alert the user
        alert("Registration forbidden: Username has to end with '@gmail.com'.");
      } else {
        // log the error
        console.log("Registration failed with status:", response.status);
        // alert the user
        alert("Username already exists!");
      }
    } catch (error) {
      // log the error
      toast.error("Error during registration: " + error.message);
      console.error("Error during registration:", error.message);
    }
  };

  // asynchronous function that handles the login submission - has two parameters
  const handleLogin = async (username, password) => {
    try {
      // Send a POST request to the API with the username and password in the request body
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // Check if the response was OK (status code 200)
      if (response.ok) {
        // Parse the response data
        const data = await response.json();
        // Save the authentication token in local storage
        localStorage.setItem("token", data.token);
        console.log("Token saved to local storage:", data.token); // Add this line


        // Show a success message to the user
        toast.success("Login successful!");

        // Use the navigate function to redirect to the home page
        navigate("/");

        // Update the state to indicate successful login (if needed)
        setIsLoggedIn(true);

        // Print the token for debugging
        console.log("Token:", data.token);
      } else {
        // If there was an error, parse the error response data
        const errorData = await response.json();
        // Log the error
        console.error("Login failed:", errorData.message);
        // Show an error message to the user
        toast.error("Login failed: Invalid username or password");
      }
    } catch (error) {
      // Log the error
      console.error("Error logging in:", error.message);
      // Show an error message to the user
      toast.error("Error logging in: " + error.message);
    }
  };


  // Function to toggle between "Login" and "Register" pages
  const toggleLoginPage = () => {
    setIsLoginPage((prevIsLoginPage) => !prevIsLoginPage);
  };

  useEffect(() => {
    // Function to check if the user is registered
    const checkRegistrationStatus = () => {
      // retrieves the token value
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      // shorthand way of of converting the token value to a boolean
      // if the token is true (not empty) the status is evaluated to true and vice versa
      setIsAdmin(!!token);
    };
    // function is called
    checkRegistrationStatus();
  }, []);

  // only fetch the tasks once the user has logged in
  useEffect(() => {
    // Fetch tasks when user is logged in
    if (isLoggedIn) {
      // asynchronous function that handles the fetching of tasks
      const fetchTasks = async () => {
        try {
          // retrive token from storage
          const token = localStorage.getItem("token");

          // GET request to API along with the token to authorise user
          const response = await fetch("http://localhost:8080/tasks", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // convert the data
          const data = await response.json();
          // if there are tasks set the state to the data
          setTasks(data);
        } catch (error) {
          // log the error
          console.error("Error fetching tasks:", error);
        }
      };
      // function is called
      fetchTasks();
    }
  }, [isLoggedIn]);

  // asynchronous function that handles the deletion of a task - has one parameters
  const handleDeleteTask = async (taskId) => {
    setPendingDeletions([...pendingDeletions, taskId]);
    const toastId = toast((t) => (
      <div>
        <div>Are you sure you want to delete this Goal?</div>
        <button
          className="yes-button"
          onClick={() => {
            // If confirmed, delete the task
            toast.dismiss(toastId);
            confirmDelete(taskId);
          }}
        >
          Yes
        </button>
        <button className="no-button" onClick={() => toast.dismiss(toastId)}>
          No
        </button>
      </div>
    ));
  
    const confirmDelete = async (taskId) => {
      try {
        await fetch(`/tasks/${taskId}`, {
          method: "DELETE",
        });
        setTasks(tasks.filter((task) => task._id !== taskId));
        toast.success("Task deleted successfully!");
      } catch (error) {
        console.log("Error deleting task:", error);
        toast.error("Error deleting task: " + error.message);
      }
    };
  };
  // Function to handle task deletion approval
  const handleApproveDeletion = (taskId) => {
    // Implement your logic to approve task deletion and remove it from pendingDeletions
    // Example:
    const updatedPendingDeletions = pendingDeletions.filter(
      (id) => id !== taskId
    );
    setPendingDeletions(updatedPendingDeletions);

    // You can also send an API request to the server to handle approval on the backend
  };
  // function that handles the selceted task to be edited - has one parameter
  const handleEditTask = (taskId) => {
    // searches for the task in the array that maches the given taskId
    const taskToEdit = tasks.find((task) => task._id === taskId);
    // sets the state to the task that matches the given taskId
    if (taskToEdit) {
      setEditTask(taskToEdit);
    }
  };

  // cancels the editing of a task by resetting the Edit state to null
  const handleCancelEdit = () => {
    setEditTask(null);
  };

  // asynchronous function that handles the updating of a task with the edited information
  const handleUpdateTask = async (updatedTaskData) => {
    try {
      const { _id: taskId } = editTask;

      const response = await fetch(`/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTaskData),
      });

      if (response.ok) {
        const updatedTaskData = await response.json();

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? updatedTaskData : task
          )
        );
        setEditTask(null);
      } else {
        // If the response status is not OK, throw an error with more context
        const responseData = await response.json();
        const errorMessage = responseData.error || "Error updating task";
        console.error("Error updating task:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  const toggle = () => {
    // Implement the logic to show/hide your component here
    console.log("Toggle function called"); // Example: You can add your toggle logic here
  };

  // asynchronous function that handles the toggle of a checkbox and completed status - has one parameter
  const handleToggleTask = async (taskId, updatedTaskData) => {
    try {
      // creates a new array by mapping over the tasks array and toggling the status of the task
      const updatedTasks = tasks.map(
        (task) =>
          // for each task in the arry it checks if the id property matches the taskId parameter
          task._id === taskId ? { ...task, completed: !task.completed } : task
        // if they match it creates a new object using the spread operator if not it returns the original task
      );

      // updates the task state by calling the setTasks function and passing the new array as the state
      setTasks(updatedTasks);

      // sends a PUT request to the API with the taskId
      await fetch(`http://localhost:8080/tasks/${taskId}/toggle`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // contains the updated completed status in the request body
        body: JSON.stringify(updatedTasks.find((task) => task._id === taskId)),
      });
    } catch (err) {
      // logs the error
      console.error(err);
    }
  };

  // function to allow the user to logout
  const handleLogout = () => {
    // set logged in to false
    setIsLoggedIn(false);
    // clear the token form the storage
    localStorage.removeItem("token");
  };

  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  /* if (!isRegistered) {
  return <Welcome />;
}      */

  return (
    <div>
      {/* Render the toast container */}
      <Toaster position="top-center" reverseOrder={false} />
      {isLoggedIn && <Sidebar />} {/* Render the Sidebar component only when isLoggedIn is true */}
      <div className="container">
        {isLoggedIn ? (
          // Render the main app content when the user is logged in

          <>
            <Button
              style={{ position: "absolute", top: "15px", right: "20px" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/help" element={<Help />} />
              <Route path="/Addtask" element={<Add addTask={addTask} />} />
              
              <Route path="/empgoal" element={<EmpGoals />} />
              <Route path="/RatingSummary" element={<RatingSummary />} />
              <Route
                path="/ShowTask"
                element={
                  <div className="task-list-container">
                    <div className="task-list-inner-container">
                    <TaskList
        tasks={tasks}
        handleDeleteTask={handleDeleteTask}
        handleEditTask={ handleEditTask}
        handleToggleTask={ handleToggleTask }
        selectedUser={selectedUser}
        isAdmin={isAdmin} // Pass isAdmin as a prop
        pendingDeletions={pendingDeletions} // Pass pendingDeletions as a prop
        handleApproveDeletion={handleApproveDeletion} // Pass the handleApproveDeletion function as a prop
      />
                    </div>
                  </div>
                }
              />
              {/* Render the Team component only for admin users */}
              console.log(isAdmin)
              {isAdmin && <Route path="/team" element={<Team />} />}

            </Routes>

            {editTask && (
              <Edit
                task={editTask}
                handleUpdateTask={handleUpdateTask}
                handleCancelEdit={handleCancelEdit}
              />
            )}
          </>
        ) : (
          // Render the registration and login components when the user is not logged in
          <>
            {isLoginPage ? (
              <Login handleLogin={handleLogin} />
            ) : (
              <Register handleRegister={handleRegister} navigate={navigate} />
            )}
            <Button
              style={{ position: "absolute", top: "15px", right: "20px" }}
              onClick={() => setIsLoginPage(!isLoginPage)}
            >
              {isLoginPage ? "Register" : "Login"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ParentComponent;
