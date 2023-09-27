import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Sidebar from "./components/Extra/Sidebar";
import ParentComponent from "./components/CRUD/ParentComponent";
import Home from "./components/CRUD/Home";
import Welcome from "./components/Authentication/Welcome"; // Import the Welcome component
import Register from "./components/Authentication/Register";
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast
import Login from "./components/Authentication/Login";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
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

        // Update the state to indicate successful login
        setIsLoggedIn(true);
        // Print the token for debugging
        console.log("Token:", data.token);
        // Show a success message to the user
        toast.success("Login successful!");
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
  return (
    <div>
      <Router>
        {isLoggedIn && <Sidebar />}
        <div>
          {isLoggedIn ? (
            <>
              <h1></h1>
              <button
                style={{ position: "absolute", top: "15px", right: "20px" }}
                onClick={handleLogout}
              >
                Logout
              </button>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
{/*                 <Route path="/login" element={<Login />} />
 */}                <Route path="/*" element={<ParentComponent />} />
              </Routes>
            </>
          ) : (
            // Render the Welcome component when the user is not logged in
            <>
              <Routes>
                <Route path="/" element={<Welcome handleLogin={() => setIsLoggedIn(true)} />} />
                <Route path="/register" element={<Register handleRegister={handleRegister} />} />
                <Route path="/login" element={<Login handleLogin={handleLogin} />} />
              </Routes>
            </>
          )}
        </div>
      </Router>
    </div>
  );
};

export default App;
