const mongoose = require("mongoose");
const Listing = require("./models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    
    const count = await Listing.countDocuments();
    console.log(`Total listings in database: ${count}`);
    
    if (count === 0) {
      console.log("No listings found. Please run init/index.js to add sample data");
    } else {
      const listings = await Listing.find({});
      console.log("First listing:", listings[0]);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.connection.close();
  }
}

main();