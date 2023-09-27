const CompanyInfo = require("../models/CompanyInfo");

exports.saveConfiguration = async (req, res) => {
  try {
    const { companyName, provinces, branches, departments, hierarchies, orgObjectives } = req.body;

    // Create a new instance of the CompanyInfo model with the received data
    const companyInfo = new CompanyInfo({
      companyName,
      provinces,
      branches,
      departments,
      hierarchies,
      orgObjectives,
    });

    // Save the configuration data to the database
    await companyInfo.save();

    res.status(201).json({ message: "Configuration data saved successfully" });
  } catch (error) {
    console.error("Error saving configuration data:", error);
    res.status(500).json({ message: "Failed to save configuration data" });
  }
};



// Function to fetch the configuration data
exports.getConfiguration = async (req, res) => {
  try {
    // Fetch the configuration data from the database
    const configurationData = await CompanyInfo.find(); // You can adjust this query as needed

    res.status(200).json(configurationData);
  } catch (error) {
    console.error("Error fetching configuration data:", error);
    res.status(500).json({ message: "Failed to fetch configuration data" });
  }
};
