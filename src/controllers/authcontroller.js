const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Caregiver = require("../models/Caregiver");
const { getIO } = require("../utils/socket");
const Notifications = require("../models/Notifications");

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    let caregiverId = null;
    if (role === "caregiver") {
      const newCaregiver = await Caregiver.create({
        userId: user._id,
        name,
        phone,
        email,
        experience: 0,
        hourlyRate: 0,
        dailyRate: 0,
      });
      caregiverId = newCaregiver._id;
    }
    await user.save();

    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await Notifications.create({
        userId: admin._id,
        type: "new_user",
        message: `New ${role} registered: ${name} (${email})`,
        serviceType: role,
        totalAmount: 0,
      });

      const io = getIO();
      io.emit("newUser", {
        type: "new_user",
        message: `New ${role} registered: ${name} (${email})`,
        serviceType: role,
        totalAmount: 0,
        createdAt: new Date(),
        isRead: false,
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, caregiverId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,

      sameSite: "none",
    });
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const caregiver = await Caregiver.findOne({ email: user.email });
    if (caregiver) {
      await Caregiver.findByIdAndUpdate(caregiver._id, { userId: user._id });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        caregiverId: caregiver ? caregiver._id : null,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getuserbyid = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await Caregiver.findOneAndDelete({ email: user.email });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });

    res.status(200).json({ message: "Login successful", success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "family" });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ isLoggedIn: false, message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ isLoggedIn: true, user: decoded });
  } catch (error) {
    console.error(error);
    res.status(401).json({ isLoggedIn: false, message: "Unauthorized" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getuserbyid,
  updateUser,
  deleteUser,
  AdminLogin,
  getAllUsers,
  verifyUser,
};
