const mongoose = require("mongoose");

const companyInfoSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  provinces: [{
    type: String,
  }],
  branches: [{
    type: String,
  }],
  departments: [{
    type: String,
  }],
  hierarchies: [{
    type: String,
  }],
  orgObjectives: [{
    type: String,
  }],
});

const CompanyInfo = mongoose.model("CompanyInfo", companyInfoSchema);

module.exports = CompanyInfo;
