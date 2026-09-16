const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const registrations = db.collection('registrations');
    
    // Find a registration
    const reg = await registrations.findOne({});
    if (!reg) {
      console.log('No registrations found.');
      process.exit(1);
    }
    
    console.log('Found Registration ID: ' + reg.registrationId);
    
    // Update to CONFIRMED
    await registrations.updateOne(
      { _id: reg._id },
      { $set: { paymentStatus: 'VERIFIED', registrationStatus: 'CONFIRMED' } }
    );
    
    console.log('Successfully updated registration to CONFIRMED.');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
