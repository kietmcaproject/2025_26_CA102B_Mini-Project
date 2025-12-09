import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    // 🔗 Reference to User (one user can have many tickets)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🧍 Passenger Information (auto-filled from user)
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    phone: {
      type: String,
      required: true,
      match: [
        /^[6-9]\d{9}$/,
        "Phone number must be 10 digits starting with 6-9",
      ],
    },
    aadhar: {
      type: String,
      required: true,
      match: [/^\d{12}$/, "Aadhar number must be 12 digits"],
    },

    // ✈️ Travel Details
    source: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    travelDate: {
      type: Date,
      required: true,
      index: true,
    },

    // 💰 Booking Details
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    bookingStatus: {
      type: String,
      enum: ["Booked", "Cancelled", "Completed"],
      default: "Booked",
    },
  },
  { timestamps: true }
);

//
// 🧠 Index for faster travel queries
//
ticketSchema.index({ source: 1, destination: 1, travelDate: 1 });

//
// 🧩 Virtual — Quick route display
//
ticketSchema.virtual("route").get(function () {
  return `${this.source} ➜ ${this.destination}`;
});

ticketSchema.set("toJSON", { virtuals: true });

//
// 🪄 Pre-save Middleware — auto-complete status if travel date has passed
//
ticketSchema.pre("save", function (next) {
  if (this.travelDate < Date.now() && this.bookingStatus === "Booked") {
    this.bookingStatus = "Completed";
  }
  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
