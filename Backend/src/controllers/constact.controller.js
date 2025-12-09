import Contact from "../models/Contact.model.js";
import User from "../models/User.model.js";
import connectDB from "../config/database.js";

connectDB();

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log(req.body);
    if (!name || !email || !message) {
      return res.status(400).json({
        status: 400,
        error: "All fields (name, email, message) are required.",
      });
    }

    let contact = await Contact.findOne({ email });
    if (contact) {
      contact.message.push(message);
      await contact.save();
    } else {
      contact = await Contact.create({
        name,
        email,
        message: [message],
      });
    }

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { queries: contact._id },
      });
    }

    return res.status(201).json({
      status: 201,
      message: "Message sent successfully!",
      data: contact,
    });
  } catch (error) {
    console.error("❌ Contact Controller Error:", error.message);
    return res.status(500).json({
      status: 500,
      error: "Failed to send message. Please try again later.",
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    // Allow only admins
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        status: 403,
        error: "Access denied. Admins only.",
      });
    }

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      status: 200,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("❌ Fetch Contacts Error:", error.message);
    res.status(500).json({
      status: 500,
      error: "Failed to fetch contact messages.",
    });
  }
};

export const getUserQueries = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        error: "Unauthorized. Please log in.",
      });
    }

    const user = await User.findById(req.user._id).populate({
      path: "queries",
      model: "Contact",
      select: "name email message createdAt",
    });

    return res.status(200).json({
      status: 200,
      data: user.queries || [],
    });
  } catch (error) {
    console.error("❌ Get User Queries Error:", error.message);
    res.status(500).json({
      status: 500,
      error: "Failed to fetch your messages.",
    });
  }
};
