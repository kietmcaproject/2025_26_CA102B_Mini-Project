import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    // 🔗 Reference to User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🧍 Guest Info (auto-filled from User)
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

    // 🌍 Hotel & Stay Info
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    roomType: {
      type: String,
      enum: ["Single Room", "Double Room", "Suite"],
      required: true,
    },

    // 📅 Stay Dates
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.checkIn;
        },
        message: "Check-out must be after check-in date",
      },
    },

    // 👥 Guest Count
    guests: {
      adults: {
        type: Number,
        min: 1,
        default: 1,
      },
      children: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    // 💰 Booking Details
    totalPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    bookingStatus: {
      type: String,
      enum: ["Booked", "Checked-In", "Completed", "Cancelled"],
      default: "Booked",
    },
  },
  { timestamps: true }
);

//
// 🧠 Indexes for Query Optimization
//
hotelSchema.index({ user: 1, destination: 1 });
hotelSchema.index({ checkIn: 1, checkOut: 1 });

//
// 🧩 Virtual Field — Calculate stay duration (in days)
//
hotelSchema.virtual("stayDuration").get(function () {
  if (!this.checkIn || !this.checkOut) return 0;
  return Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
});

hotelSchema.set("toJSON", { virtuals: true });

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
