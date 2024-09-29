import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

// Registration
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "Please fill full form!" });
    }

    const isEmail = await User.findOne({ email });
    if (isEmail) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const bcryptSalt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    // const token = jwt.sign(
    //   { email: user.email, id: user._id },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: "1d" }
    // );

    res.status(201).json({
      success: true,
      message: "User Registered!",
      // token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please provide email, password, and role." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid Email Or Password." });
    }

    const isPasswordMatched = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid Email Or Password." });
    }

    if (user.role !== role) {
      return res
        .status(404)
        .json({ message: `User with provided email and ${role} not found!` });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login Success",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User
export const getUser = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
