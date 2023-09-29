import React, { useState, useEffect } from "react";
import TaskList from "../CRUD/TaskList";
import { fetchAllUsers, fetchUserTasks } from './fetchUsers';
import './Team.css';

function EmpGoals() {
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [userGoals, setUserGoals] = useState([]); // Initialize userGoals state

  useEffect(() => {
    async function getUsers() {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem("token");

        // Pass the token as an argument to fetchAllUsers
        const allUsers = await fetchAllUsers(token);
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    getUsers();
  }, []);

  const handleUserSelect = (e) => {
    const selectedUserId = e.target.value;
    setSelectedUser(selectedUserId);

    // Fetch or set user goals based on the selected user
    // For example, you can call fetchUserGoals(selectedUserId)
    // to fetch goals/tasks assigned to the selected user.
  };

  useEffect(() => {
    // Fetch or set user goals based on the selected user
    // For example, you can call fetchUserGoals(selectedUser)
    // when the selected user changes.
  }, [selectedUser]);

  const isAdmin = localStorage.getItem("userRole") === "admin";

  return (
    <div className="team-container">
      <div className="form-group team-dropdown">
        <label>Select a User</label>
        <select
          className="form-control"
          value={selectedUser}
          onChange={handleUserSelect}
        >
          <option value="">Select a user...</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      
      <TaskList tasks={userGoals} /> {/* Pass userGoals as the tasks prop to TaskList */}
    </div>
  );
}

export default EmpGoals;