/* Defines a Mongoose schema for an object and exports it as a model*/

// import mongoose module
const mongoose = require("mongoose");

// schema defines the structure and properties of the user object
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // marked as unique -> each username must be diffrent from the previous
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  privilege: {
    type: String,
    enum: ["Read", "Read and Write", "Full Control"],
    default: "Read",
  },
   Province: {
    type: String,
    enum: ["Eastern Cape",  "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga",  "Northern Cape", "North West" ,  "Western Cape"],
    default: "Western Cape",
  },

  Reviewer: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviewer"
    }
  ],

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
 

});

// Creating the model
const User = mongoose.model("User", userSchema);

// export the User module
module.exports = User;
