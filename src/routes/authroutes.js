const express = require("express");
const router = express.Router();
const Caregiver = require("../models/Caregiver");
const {
  registerUser,
  loginUser,
  getuserbyid,
  updateUser,
  deleteUser,
  AdminLogin,

  verifyUser,
  getAllUsers,
} = require("../controllers/authcontroller");

const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const FRONTEND_URL = process.env.CLIENT_URL;

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/users/:id", updateUser);
router.get("/users/:id", getuserbyid);
router.delete("/users/:id", deleteUser);
router.post("/adminlogin", AdminLogin);
router.get("/users", getAllUsers);
router.get("/verify", verifyUser);

router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/", sameSite: "none", secure: true });

  res.status(200).json({ message: "Logout successful" });
});

router.get("/google", (req, res, next) => {
  const role = req.query.role;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: role,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const role = req.query.state || "family";

    await User.findByIdAndUpdate(req.user._id, { role });

    const caregiver = await Caregiver.findOne({ email: req.user.email });

    const token = jwt.sign(
      {
        userId: req.user._id,
        role: req.user.role,
        caregiverId: caregiver ? caregiver._id : null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });

    if (role === "caregiver") {
      const existingCaregiver = await Caregiver.findOne({
        email: req.user.email,
      });
      if (!existingCaregiver) {
        const newCaregiver = new Caregiver({
          name: req.user.name,
          email: req.user.email,
        });
        await newCaregiver.save();
      }
      res.redirect(`${FRONTEND_URL}/caregiver-dashboard?token=${token}`);
    } else if (role === "family") {
      res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`);
    } else {
      res.redirect(`${FRONTEND_URL}/?token=${token}`);
    }
  },
);
router.get("/me", (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
