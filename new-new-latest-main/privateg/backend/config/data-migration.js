/* // data-migration.js
const mongoose = require('mongoose');
const User = require('../models/userSchema'); // Import your User model

async function performDataMigration() {
  try {
    await mongoose.connect('mongodb://localhost/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Update all existing users to have the "user" role
    const result = await User.updateMany({}, { $set: { role: 'user' } });

    console.log('Users updated successfully:', result.modifiedCount, 'documents updated.');
  } catch (err) {
    console.error('Error updating users:', err);
  } finally {
    mongoose.connection.close();
  }
}

performDataMigration();
 */