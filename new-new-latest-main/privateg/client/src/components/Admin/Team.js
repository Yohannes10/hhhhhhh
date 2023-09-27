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
  const [tasks, setTasks] = useState([]); // Create a state to store tasks

  // Function to add a task to the tasks array
  const addTask = (task) => {
    // Create a new array with the added task
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
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
    setSelectedUser(e.target.value);
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
      {/* Pass the selectedUser and addTask as props to the Add component */}
      <Add addTask={addTask} selectedUser={selectedUser} />
      <TaskList
        tasks={tasks.filter((task) => task.userId === selectedUser)} // Filter tasks based on selectedUser
        handleDeleteTask={handleDeleteTask}
        handleEditTask={handleEditTask}
        handleToggleTask={handleToggleTask}
        toggle={toggle}
      />
    </div>
  );
}

export default Team;
