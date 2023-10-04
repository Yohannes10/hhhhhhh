import React, { useState, useEffect } from "react";
import { fetchAllUsers } from './fetchUsers';
import Add from "../CRUD/Add";
import "./Team.css";
import TaskList from "../CRUD/TaskList";

function Team({
  handleDeleteTask,
  handleEditTask,
  handleToggleTask,
  toggle,
}) {
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [allUserTasks, setAllUserTasks] = useState([]); // Create a state to store all user tasks

  // Function to add a task to the allUserTasks array
  const addTaskToAllUserTasks = (task) => {
    // Create a new array with the added task
    const updatedAllUserTasks = [...allUserTasks, task];
    setAllUserTasks(updatedAllUserTasks);
  };

  useEffect(() => {
    async function getUsers() {
      try {
        const token = localStorage.getItem("token");
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
    console.log("Selected User:", selectedUserId); // Check if selectedUser is correct
    setSelectedUser(selectedUserId);
  };

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
      {/* Pass the selectedUser and addTaskToAllUserTasks as props to the Add component */}
      <Add addTask={addTaskToAllUserTasks} selectedUser={selectedUser} />
    </div>
  );
}

export default Team;
