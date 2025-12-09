import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import chalk from "chalk";
import connectDB from "../config/database.js";

dotenv.config();

connectDB();
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    console.log(req.body);
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        status: 400,
        error: "All Fields are required",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: 400,
        error: "User already exists",
      });
    }

    const user = await User.create({ name, email, password, role });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        status: 201,
        message: "User created successfully",
        data: user,
        token,
      });

    console.log(
      chalk.green.bold(`✅ New User Registered:`),
      chalk.blue(`${user.name} (${user.email})`)
    );
  } catch (error) {
    console.error(chalk.red.bold("❌ Signup Error:"), error.message);
    res.status(500).json({
      status: 500,
      error: "Server error. Please try again later.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        error: "All Fields are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: "User not found. Please register first.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        error: "Invalid credentials.",
      });
    }


    if (!user.isActive) {
      return res.status(403).json({
        status: 403,
        error: "Your account has been deactivated. Contact support.",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      status: 200,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({
      status: 500,
      error: "Internal server error.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({
        status: 200,
        message: "Logged out successfully.",
      });
  } catch (error) {
    console.error("❌ Logout Error:", error.message);
    res.status(500).json({
      status: 500,
      error: "Server error while logging out.",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error fetching profile." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    const allowed = ["name", "email", "password"];
    allowed.forEach((field) => {
      if (req.body[field]) updates[field] = req.body[field];
    });

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found." });

    if (updates.password) {
      const salt = await bcrypt.genSalt(12);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    Object.assign(user, updates);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error updating profile." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: "Server error fetching users." });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully.`,
    });
  } catch (err) {
    console.error("Toggle status error:", err);
    res.status(500).json({ message: "Server error updating user status." });
  }
};
