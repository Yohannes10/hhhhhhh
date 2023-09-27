import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import styles from "../styles/Username.module.css";
import Register from "./Register";
import ConfigurationSummary from "./ConfigurationSummary";
const Welcome = ({ handleLogin }) => {
  const [showSummary, setShowSummary] = useState(false);

  const [configData, setConfigData] = useState({
    companyName: "",
    provinces: [],
    branches: [],
    departments: [],
    hierarchies: [],
    orgObjectives: [],
  });

  const [newProvince, setNewProvince] = useState("");
  const [newBranch, setNewBranch] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newHierarchy, setNewHierarchy] = useState("");
  const [newOrgObjective, setNewOrgObjective] = useState("");


  const navigate = useNavigate();
  const navigateToRegister = () => {
    console.log("configData before navigation:", configData);

    // Use the `navigate` function from react-router-dom to navigate to the Register page
    navigate("/register", { state: { configData } });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming you have an API endpoint to save the configuration data
      const response = await fetch('http://localhost:8080/admin/configurations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });

      if (response.ok) {
        // Configuration data saved successfully
        // You can provide feedback to the user here, e.g., using toast
        toast.success('Configuration data saved successfully');
/*         navigate("/register", { state: { configData } });
 */      } else {
        // Handle server error or validation error
        const errorMessage = await response.text();
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error:', error);
      toast.error('Failed to save configuration data');
    }
  };


  const updateCompanyName = (name) => {
    setConfigData({ ...configData, companyName: name });
  };

  const handleAddProvince = () => {
    if (newProvince.trim() !== "") {
      setConfigData({
        ...configData,
        provinces: [...configData.provinces, newProvince],
      });
      setNewProvince(""); // Clear the input field
    }
  };

  const handleAddBranch = () => {
    if (newBranch.trim() !== "") {
      setConfigData({
        ...configData,
        branches: [...configData.branches, newBranch],
      });
      setNewBranch(""); // Clear the input field
    }
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim() !== "") {
      setConfigData({
        ...configData,
        departments: [...configData.departments, newDepartment],
      });
      setNewDepartment(""); // Clear the input field
    }
  };

  const handleAddHierarchy = () => {
    if (newHierarchy.trim() !== "") {
      setConfigData({
        ...configData,
        hierarchies: [...configData.hierarchies, newHierarchy],
      });
      setNewHierarchy(""); // Clear the input field
    }
  };

  const handleAddOrgObjective = () => {
    if (newOrgObjective.trim() !== "") {
      setConfigData({
        ...configData,
        orgObjectives: [...configData.orgObjectives, newOrgObjective],
      });
      setNewOrgObjective(""); // Clear the input field
    }
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: '45%', height: '90%' }}>
          <form className="py-1" onSubmit={handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              {/* Company Name input */}
              <div className="flex gap-2 items-center">
                <h4 className={`${styles.text} text-gray-500 text-lg`} htmlFor="companyName">Company Name</h4>
                <input
                  className={styles.textbox}
                  type="text"
                  id="companyName"
                  value={configData.companyName}
                  onChange={(e) => updateCompanyName(e.target.value)}
                />
              </div>

              {/* Province input */}
              <div className="flex gap-2 items-center">
                <h4 className={`${styles.text} text-gray-500 text-lg`} htmlFor="province"> Province</h4>
                <input
                  className={styles.textbox}
                  type="text"
                  id="province"
                  value={newProvince}
                  onChange={(e) => setNewProvince(e.target.value)}
                />
                <button className={styles.btn} type="button" onClick={handleAddProvince}>Add Province</button>
              </div>

              {/* Branches input */}
              <div className="flex gap-2 items-center">
                <h4 className={`${styles.text} text-gray-500 text-lg`} htmlFor="branches"> Branches</h4>
                <input
                  className={styles.textbox}
                  type="text"
                  id="branches"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                />
                <button className={styles.btn} type="button" onClick={handleAddBranch}>Add Branches</button>
              </div>

              {/* Department input */}
              <div className="flex gap-2 items-center">
                <h4 className={`${styles.text} text-gray-500 text-lg`} htmlFor="department"> Department</h4>
                <input
                  className={styles.textbox}
                  type="text"
                  id="department"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                />
                <button className={styles.btn} type="button" onClick={handleAddDepartment}>Add Department</button>
              </div>

              {/* Hierarchy input */}
              <div className="flex gap-2 items-center">
                <h4 className={`${styles.text} text-gray-500 text-lg`} htmlFor="hierarchy"> Hierarchy</h4>
                <input
                  className={styles.textbox}
                  type="text"
                  id="hierarchy"
                  value={newHierarchy}
                  onChange={(e) => setNewHierarchy(e.target.value)}
                />
                <button className={styles.btn} type="button" onClick={handleAddHierarchy}>Add Hierarchy</button>
              </div>

              {/* Organizational Objectives input */}
              <div className="flex gap-2 items-center">
                <h4 className={`${styles.text} text-gray-500 text-lg`} htmlFor="orgObjectives"> Organizational Objectives</h4>
                <input
                  className={styles.textbox}
                  type="text"
                  id="orgObjectives"
                  value={newOrgObjective}
                  onChange={(e) => setNewOrgObjective(e.target.value)}
                />
                <button className={styles.btn} type="button" onClick={handleAddOrgObjective}>Add Org objectives</button>
              </div>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                <Link className="text-red-500"  onClick={navigateToRegister} >Proceed to Register</Link>
              </span>
              
            </div>
         
            {showSummary && <ConfigurationSummary configData={configData} />}
            <button className={styles.btn} onClick={() => setShowSummary(!showSummary)}>
              {showSummary ? "Hide Summary" : "Show Summary"}
            </button>
            <button
  className={styles.btn}
  type="button"
  onClick={() => navigate('/register', { state: { configData: configData } })} // Specify the path to Register.js
>
  Register
</button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Welcome;