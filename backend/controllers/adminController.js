const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminModel = require("../model/adminModel.js");
const userModel = require("../model/userModel.js");


const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/.test(password);

const trimInput = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] === "string") obj[key] = obj[key].trim();
  }
  return obj;
};


const createAdmin = async (req, res) => {
  try {
    let { name, email, password, confirmPassword } = trimInput(req.body);

    // --- Validation ---
    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }


    if (await adminModel.findOne({ email })) {
      return res
        .status(409)
        .json({ message: "Admin already registered with this email." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

  
    const admin = await adminModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const payload = { id: admin._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      message: "Admin created successfully",
      data: admin,
      token,
    });
  } catch (error) {
    console.error("Admin creation failed:", error);
    return res.status(500).json({
      message: "Internal server issue during admin creation",
      details: error.message,
    });
  }
};


const adminLogin = async (req, res) => {
  try {
    let { email, password } = trimInput(req.body);

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const adminExisting = await adminModel.findOne({ email });
    if (!adminExisting) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const comparePassword = await bcrypt.compare(password, adminExisting.password);
    if (!comparePassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
      id: adminExisting._id,
      email: adminExisting.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      id: adminExisting._id,
      email: adminExisting.email,
      name: adminExisting.name,
    });
  } catch (error) {
    console.error("Admin login failed:", error);
    return res.status(500).json({
      message: "Internal server issue during login",
      details: error.message,
    });
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

const adminUpdating = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = trimInput(req.body);

    // Validate updates if email or password provided
    if (updateData.email && !isValidEmail(updateData.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (updateData.password) {
      if (!isValidPassword(updateData.password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
        });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedAdmin = await adminModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res
      .status(200)
      .json({ message: "Admin updated successfully", data: updatedAdmin });
  } catch (error) {
    console.error("Admin update failed:", error);
    return res.status(500).json({
      message: "Internal server issue during update",
      details: error.message,
    });
  }
};


const adminGetAllUsers = async (req, res) => {
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


const adminGetUserById = async (req, res) => {
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


const adminSoftDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User soft-deleted", user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createAdmin,
  adminLogin,
  adminUpdating,
  adminGetAllUsers,
  adminGetUserById,
  adminSoftDeleteUser,
  updateUser
};
