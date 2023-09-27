import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import Rating from "react-rating-stars-component";
import Delete from "./Delete";
import "./TaskList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Table from "../Extra/Table/Table";
import axios from "axios";
import toast from "react-hot-toast";

const TaskList = ({
  tasks,
  handleDeleteTask,
  handleEditTask,
  handleToggleTask,
  selectedUser, // Add selectedUser as a prop
}) => {
  const [ratings, setRatings] = useState({});
  const [tableVisibility, setTableVisibility] = useState(
    Array(tasks.length).fill(false)
  );

  const handleRatingChange = async (taskId, rating) => {
    try {
      // Create an object to represent the rating data
      const ratingData = {
        taskId: taskId,
        rating: rating,
      };

      // Send a POST request to the backend to store the rating data
      const response = await axios.post(
        "http://localhost:8080/ratings", // Replace with your backend endpoint for storing ratings
        ratingData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        // Rating data stored successfully
        toast.success("Rating submitted successfully!");
      } else {
        // Handle errors or validation issues if needed
        toast.error("Failed to submit rating.");
      }
    } catch (error) {
      // Handle any network errors or exceptions
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    }
  };

  const toggleTable = (index) => {
    const updatedVisibility = [...tableVisibility];
    updatedVisibility[index] = !updatedVisibility[index];
    setTableVisibility(updatedVisibility);
  };

  useEffect(() => {
    console.log("Tasks Prop Updated in TaskList:", tasks);
  }, [tasks]);

  return (
    <div data-testid="task-list-container">
      <div className="row">
        <div className="row justify-content-center align-items-center">
          {tasks &&
            tasks
              .filter((task) => task.userId === selectedUser) // Filter tasks based on selectedUser
              .map((task, index) => (
                <div className="col-md-4 p-2 my-2" key={task._id}>
                  <div className="card rounded-0">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5>{task.title}</h5>
                      <Button
                        onClick={() => handleEditTask(task._id)}
                        className="btn btn-sm"
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="card-body">
                      <Form.Check
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                          handleToggleTask(task._id, {
                            completed: !task.completed,
                          })
                        }
                        style={{
                          border: "2px solid #007bff",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                          borderRadius: "px",
                          padding: "4px",
                          width: "25px",
                        }}
                      />
                      <p>Description: {task.description}</p>
                      <p>
                        Date:{" "}
                        {new Date(task.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <div className="d-flex flex-column align-items-center">
                        <label className="mb-2">
                          Please Rate Your Performance
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            style={{
                              fontSize: "24px",
                              marginLeft: "8px",
                              cursor: "pointer",
                            }}
                            onClick={() => toggleTable(index)}
                          />
                        </label>
                        <Rating
                          count={5}
                          size={24}
                          value={ratings[task._id] || 0}
                          onChange={(newRating) =>
                            handleRatingChange(task._id, newRating)
                          }
                          half={false}
                        />
                      </div>
                      <div
                        className={`tooltip ${
                          tableVisibility[index] ? "show" : ""
                        }`}
                      >
                        {/* Your table content goes here */}
                        <div className="tooltip-content">
                          <Table />
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button
                          onClick={() => handleDeleteTask(task._id)}
                          className="btn btn-sm delete-button"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
