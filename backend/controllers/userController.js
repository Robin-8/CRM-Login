const userModel = require("../model/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwt.cjs");


const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


const isValidPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/.test(password);

const createCustomer = async (req, res) => {
  let { name, email, password } = req.body;

 
  name = name?.trim();
  email = email?.trim();
  password = password?.trim();

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
    });
  }

  try {
  
    if (await userModel.findOne({ email })) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }

    // Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: "Customer created successfully",
      data: user,
      token: token,
    });
  } catch (error) {
    console.error("User creation failed:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", details: error.message });
  }
};

const login = async (req, res) => {
  let { email, password } = req.body;
  email = email?.trim();
  password = password?.trim();

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const userExisting = await userModel.findOne({ email });
    if (!userExisting) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const comparePassword = await bcrypt.compare(password, userExisting.password);
    if (!comparePassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(userExisting);
    return res.status(200).json({
      message: "Login successful",
      token: token,
      id: userExisting._id,
      email: userExisting.email,
      name: userExisting.name,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server issue", details: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  let { name, email, password } = req.body;

  name = name?.trim();
  email = email?.trim();
  password = password?.trim();

  try {
    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;

    if (email && email !== user.email) {
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (password) {
      if (!isValidPassword(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found", data: [] });
    }
    return res.status(200).json({ message: "All user list", data: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createCustomer,
  login,
  updateUser,
  getAllUsers,
  getUserById,
};
