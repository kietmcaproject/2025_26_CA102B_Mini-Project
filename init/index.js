const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log(" Connected to DB"))
  .catch((err) => console.error(" DB Connection Error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Cleared existing listings");
    
    initData.data = initData.data.map((obj) => ({
      ...obj, 
      owner: "68fd1d67e80e38c21073f25d"
    }));
    
    const insertedData = await Listing.insertMany(initData.data);
    console.log(`Successfully initialized ${insertedData.length} listings`);
    
    // Verify the data
    const count = await Listing.countDocuments();
    console.log(`Total listings in database: ${count}`);
    
    mongoose.connection.close();
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
}


// const initDB = async () => {
//   try {
//     await Listing.deleteMany({});
//     console.log(" Old data deleted!");

//     await Listing.insertMany(initData.data);
//     console.log(" Sample data inserted successfully!");

//     mongoose.connection.close();
//     console.log(" Connection closed.");
//   } catch (err) {
//     console.error(" Error while seeding data:", err);
//   }
// };

initDB();
