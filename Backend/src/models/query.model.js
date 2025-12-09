import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    // 👤 Linked user (optional: allows guest messages too)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    // 🧍 Sender details
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name must not exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      index: true,
    },

    // 💬 Message content
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message should be at least 10 characters long"],
      maxlength: [1000, "Message should not exceed 1000 characters"],
    },

    // 🧾 Query status (for admin dashboard)
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

//
// ⚙️ Indexes for efficient querying
//
contactSchema.index({ email: 1, status: 1 });
contactSchema.index({ user: 1, createdAt: -1 });

//
// 🧠 Virtual Field — Message Preview (for admin UI / analytics)
//
contactSchema.virtual("preview").get(function () {
  return this.message.length > 60
    ? this.message.slice(0, 60) + "..."
    : this.message;
});

contactSchema.set("toJSON", { virtuals: true });

//
// ✅ Correct model naming convention
//
const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
