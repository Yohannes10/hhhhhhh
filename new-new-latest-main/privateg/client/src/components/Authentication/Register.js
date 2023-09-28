import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../Authentication/assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import convertToBase64 from "../Authentication/helper/convert";
import styles from "../styles/Username.module.css";
import zxcvbn from "zxcvbn";
import { useLocation } from "react-router-dom";

const Register = ({ handleRegister }) => {
  // State variables to manage user input values
  const [file, setFile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  // Import the enum values from your Mongoose schema
  const privilegeOptions = ["Read", "Read and Write", "Full Control"];

  const [reviewers, setReviewers] = useState([]);
  const [privilege, setPrivilege] = useState("");
  const [province, setProvince] = useState("");
  const [department, setDepartment] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [branch, setBranch] = useState("");
  const [hierarchy, setHierarchy] = useState("");


  const navigate = useNavigate();
  const location = useLocation();
  const configData = location.state?.configData || {};
  /*  const provinceOptions = configData?.provinces || [];
   const branchOptions = configData?.branches || [];
   const departmentOptions = configData?.departments || [];
   const hierarchyOptions = configData?.hierarchies || [];
   const orgObjectiveOptions = configData?.orgObjectives || []; */
  /* const navigateToWelcomePage = () => {
    console.log("Navigating to Welcome page");
    navigate("/welcome"); // Replace "/welcome" with the actual path to your Welcome.js page
  };
 */

  useEffect(() => {

    console.log("configData received:", configData); // Add this line to check if configData is received

    // Fetch reviewers from the backend when the component mounts
    const fetchReviewers = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/reviewers");
        if (response.ok) {
          const data = await response.json();
          setReviewers(data);
        } else {
          console.error("Failed to fetch reviewers");
        }
      } catch (error) {
        console.error("Error fetching reviewers:", error);
      }
    };

    fetchReviewers();
  }, []);

  const handleSubmit = async () => {
    // Validate input values
    if (!email || !username || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
  
    if (!email.match(/@gmail\.com$/)) {
      toast.error("Only Gmail addresses are allowed.");
      return;
    }
  
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) {
      toast.error("Password is too weak. Please use a stronger password.");
      return;
    }
  
    try {
      await handleRegister(username, password, email, confirmPassword);
      setUsername("");
      setPassword("");
      setEmail("");
      setConfirmPassword("");
      toast.success("Registration successful!");
      console.log('Navigating to login...');
      navigate('/login');
    } catch (error) {
      toast.error("Failed to register. Please try again.");
    }
  };

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };
  return (
    <div className="container mx-auto h-screen flex flex-col">

      {/* Title */}
      <div className="title mb-4">
        <h4 className="text-5xl font-bold">REGISTER</h4>
        <span className="py-4 text-xl text-center text-gray-500">
          Happy to join you!
        </span>
      </div>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex-grow flex justify-between">
        {/* Left Column */}
        <div className={styles.glass} style={{ width: "45%", height: "100%" }}>
          <div className="flex flex-col w-full items-center">
            <form className="py-8" onSubmit={handleSubmit}>
              <div className="profile flex justify-center py-1">
                <label htmlFor="profile">
                  <img
                    src={file || avatar}
                    className={`${styles.profile_img}`}
                    alt="avatar"
                  />
                </label>
                <input
                  onChange={onUpload}
                  type="file"
                  id="profile"
                  name="profile"
                />
              </div>

              <div className="textbox flex flex-col items-center gap-2">
                {/* Input fields for email, username, password, and confirm password */}
                <input
                  className={styles.textbox}
                  type="text"
                  placeholder="Email*"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className={styles.textbox}
                  type="text"
                  placeholder="Full name*"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  className={styles.textbox}
                  type="password"
                  placeholder="Password*"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <input
                  className={styles.textbox}
                  type="password"
                  placeholder="Confirm Password*"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <input
                  className={styles.textbox}
                  type="text"
                  placeholder="EMPID"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.glass} style={{ width: "45%", height: "100%" }}>
          <div className="flex flex-col w-full items-center">
            <div className="textbox flex flex-col items-center gap-2">
              {/* Dynamic dropdown for Privilege */}
              <select
                className={styles.textbox}
                onChange={(e) => setPrivilege(e.target.value)}
              >
                <option value="">Select a Privilege *</option>
                {privilegeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Dynamic dropdown for Province */}
              <select
                className={styles.textbox}
                onChange={(e) => setProvince(e.target.value)}
              >
                <option value="">Select a Province *</option>
                {configData.provinces && configData.provinces.length > 0 ? (
                  configData.provinces.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Loading...
                  </option>
                )}
              </select>

              {/* Dynamic dropdown for Branch */}
              <select
                className={styles.textbox}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="">Select a Branch *</option>
                {configData.branches && configData.branches.length > 0 ? (
                  configData.branches.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Loading...
                  </option>
                )}
              </select>

              {/* Dynamic dropdown for Department */}
              <select
                className={styles.textbox}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select a Department *</option>
                {configData.departments && configData.departments.length > 0 ? (
                  configData.departments.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Loading...
                  </option>
                )}
              </select>
              <select
                className={styles.textbox}
                onChange={(e) => setHierarchy(e.target.value)}
              >
                <option value="">Select a Hierarchy *</option>
                {configData.hierarchies && configData.hierarchies.length > 0 ? (
                  configData.hierarchies.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Loading...
                  </option>
                )}
              </select>
              {/* Dynamic dropdown for Reviewer */}
              <select
                className={styles.textbox}
                onChange={(e) => setReviewer(e.target.value)}
              >
                <option value="">Select Your Reviewer *</option>
                {reviewers.map((reviewer) => (
                  <option key={reviewer} value={reviewer}>
                    {reviewer}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons outside of the glasses */}
      {/* Register Button */}
      <div className="flex justify-center mt-4">
  <button className={styles.btn} type="button" onClick={handleSubmit}>
    Register
  </button>
</div>

      {/* Setup System Button */}
      <div className="flex justify-center mt-4">
        <button
          className={styles.btn}
          type="button"
          onClick={() => navigate('/')}
        >
          Setup System
        </button>
      </div>

    </div>
  );
};

export default Register;
