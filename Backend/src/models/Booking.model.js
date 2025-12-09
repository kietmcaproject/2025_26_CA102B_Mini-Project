import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"],
    },
    aadhar: {
      type: String,
      required: [true, "Aadhar number is required"],
      match: [/^\d{12}$/, "Aadhar number must be 12 digits"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    source: {
      type: String,
      required: [true, "Source is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Travel date is required"],
    },
    passengers: {
      type: Number,
      required: [true, "Number of passengers is required"],
      min: [1, "At least one passenger required"],
    },
    fare: {
      type: Number,
      required: [true, "Fare amount is required"],
      min: [1, "Fare must be greater than 0"],
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
