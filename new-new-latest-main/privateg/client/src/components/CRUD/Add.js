import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap"; // Import Modal and Form components
import DatePicker from "react-datepicker";
import "./Add.css";
import Table from "../Extra/Table/Table";

// Add Component: Allows users to create goals with specified details
const Add = ({ addTask, selectedUser }) => {
  console.log(selectedUser);
  // State to manage input values and selected date
  const [content, setContent] = useState({
    title: "",
    frequency: "", // New field for goal measurement frequency
    date: new Date(),
    userSelected: "",
    users: [],
    _id: "",
  });

  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const handleOpenAddGoalModal = () => {
    setShowAddGoalModal(true);
  };

  const handleCloseAddGoalModal = () => {
    setShowAddGoalModal(false);
  };

  const handleNewGoalTitleChange = (e) => {
    setNewGoalTitle(e.target.value);
  };

  const handleNewGoalDescriptionChange = (e) => {
    setNewGoalDescription(e.target.value);
  };

  const [task, setTask] = useState({
    title: "",
    description: "",
    date: new Date(),
  });
  // Function to update date when the user selects a new one
  const onChangeDate = (date) => setContent({ ...content, date });

  // Function to handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    /* console.log(e)
    return */
    if (!content.title || content.title.trim() === "") {
/*       alert("Please enter a title for the task.");
 */      return;
    }
    // Call the addTask function passed as a prop to add the goal
    addTask(content);
    // Clear input fields after submission
    setContent({
      title: "",
      description: "",
      date: new Date(),
    });
  };

  // Function to handle input changes
  const onChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  // State to store departmental goals fetched from the server
  const [departmentalGoals, setDepartmentalGoals] = useState([]);

  // Fetch departmental goals from the server on component mount
  useEffect(() => {
    const fetchDepartmentalGoals = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/departmental-goals"
        );
        if (response.ok) {
          const data = await response.json();
          setDepartmentalGoals(data);
        }
      } catch (error) {
        console.error("Error fetching departmental goals:", error);
      }
    };
    fetchDepartmentalGoals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleDateChange = (date) => {
    setTask({ ...task, date });
  };

  const handleAssignTask = () => {
    // Check if the required fields are filled
    if (!task.title || task.title.trim() === "") {
/*       alert("Please enter a title for the task.");
 */      return;
    }

    // Create a task object with user ID and task details
    const taskToAssign = {
      userId: selectedUser,
      title: task.title,
      description: task.description,
      date: task.date,
    };

    // Call a function to assign the task
    assignTaskToUser(taskToAssign);

    // Clear the form after assigning the task
    setTask({
      title: "",
      description: "",
      date: new Date(),
    });
  };

  // Function to assign the task to the selected user (You need to implement this)
  // Function to assign the task to the selected user
  const assignTaskToUser = async (task) => {
    try {
      const token = localStorage.getItem("token"); // Assuming you have a token for authentication

      const response = await fetch(
        "http://localhost:8080/tasks/assign-new-task",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: task.userId, task }),
        }
      );

      if (response.ok) {
        // Task assigned successfully
        console.log("Task assigned to user:", task);
        // You may add additional logic here to handle success, e.g., show a success message to the user.
      } else {
        // Handle the case where the task assignment fails
        console.error("Failed to assign task:", response.statusText);
        // You can display an error message to the user.
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      // You can display an error message to the user.
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <div className="card card-body">
        <h2>Create a Goal</h2>
        <div>
          <h4>
            Goals describe specific objectives you want to achieve in your job,
            for a specific period of time. Goals change on every period. Make
            sure you define goals in SMART terms —
            <span className="bold-first-letter">S</span>pecific,
            <span className="bold-first-letter">M</span>easurable,
            <span className="bold-first-letter">A</span>ttainable,
            <span className="bold-first-letter">R</span>ealistic, and
            <span className="bold-first-letter">T</span>ime-bound.
          </h4>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mb-2">
            <div className="form-group">
              {/* Dropdown for selecting a departmental goal */}
              <select
                className="form-control"
                placeholder="Select a Departmental Goal"
                name="departmentalGoal"
                value={content.departmentalGoal}
                onChange={onChange}
                required
              >
                <option value="">Select an Organisational Objective</option>
                {departmentalGoals.map((goal) => (
                  <option key={goal._id} value={goal._id}>
                    {goal.title}
                  </option>
                ))}
              </select>
              {/*    <button
                type="button"
                className="btn btn-success ml-2"
                onClick={handleOpenAddGoalModal}
              >
                Add (+)
              </button> */}
            </div>
            {/* Input field for the task title */}
            <div>
              <input
                type="text"
                className="form-control"
                placeholder="Goal title"
                name="title"
                value={content.title}
                onChange={onChange}
                required
                autoFocus
              />
            </div>
            {/* Input field for the task description */}
            <div>
              <input
                type="text"
                className="form-control"
                placeholder="   What needs to be achieved and how?"
                name="description"
                value={content.description}
                onChange={onChange}
                required
              />
            </div>
          </div>
          {/* Input field for the task title */}
          <div>
            <input
              type="text"
              className="form-control"
              placeholder="   What is the quantifiable metric?"
              name="title"
            /*  value={content.title}
             onChange={onChange}
             required
             autoFocus */
            />
          </div>

          {/* Input field for the task title */}
          <div>
            <input
              type="text"
              className="form-control"
              placeholder="   How does it align with the organizational objective?"
              name="title"
            /*  value={content.title}
             onChange={onChange}
             required
             autoFocus */
            />
          </div>
          <div className="form-group">
            {/* DatePicker for selecting a date */}
            <input
      type="text"
      className="form-control"
      placeholder="How frequently to measure the goal?"
      name="frequency"
      value={content.frequency}
      onChange={onChange}
      required
    />
          </div>
          {/* Button to submit the form */}
          <Button
            type="submit"
            className="btn btn-primary"
            onClick={handleAssignTask}
          >
            Add Goal
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Add;

// End of Add Component
/* The Add component enables users to create goals with specific 
details. It provides input fields for a task's title, description,
 date, and a dropdown for selecting a departmental goal. Users can
  submit the form to add a new goal. The component also fetches
   departmental goals from the server and displays them in a 
   dropdown.  */
