// ConfigurationSummary.js
import React from "react";
import styles from "./ConfigurationSummary.module.css"; // Import the CSS module


const ConfigurationSummary = ({ configData }) => {
  return (
    <div className={styles["configuration-summary"]}> {/* Apply the CSS class */}
      <h2>Configuration Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Configuration Option</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Company Name</td>
            <td>{configData.companyName}</td>
          </tr>
          <tr>
            <td>Provinces</td>
            <td>
              <ul>
                {configData.provinces.map((province, index) => (
                  <li key={index}>{province}</li>
                ))}
              </ul>
            </td>
          </tr>
          <tr>
            <td>Branches</td>
            <td>
              <ul>
                {configData.branches.map((branch, index) => (
                  <li key={index}>{branch}</li>
                ))}
              </ul>
            </td>
          </tr>
          <tr>
            <td>Departments</td>
            <td>
              <ul>
                {configData.departments.map((department, index) => (
                  <li key={index}>{department}</li>
                ))}
              </ul>
            </td>
          </tr>
          <tr>
            <td>Hierarchy</td>
            <td>
              <ul>
                {configData.hierarchies.map((hierarchy, index) => (
                  <li key={index}>{hierarchy}</li>
                ))}
              </ul>
            </td>
          </tr>
          <tr>
            <td>Organizational Objectives</td>
            <td>
              <ul>
                {configData.orgObjectives.map((orgObjective, index) => (
                  <li key={index}>{orgObjective}</li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ConfigurationSummary;
