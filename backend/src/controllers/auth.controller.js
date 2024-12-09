import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signup = async (req, res) => {
	const { fullName, email, password } = req.body;
	try {
		if (!fullName || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (!emailPattern.test(email)) {
			return res.status(400).json({ message: "Invalid email" });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters" });
		}

		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: "Email already exists" });
		}
		const hashPassword = await bcrypt.hash(password, 10);
		const newUser = await new User({
			fullName,
			email,
			password: hashPassword,
		});
		await generateToken(newUser._id, res);
		await newUser.save();
		return res.status(201).json({
			_id: newUser._id,
			fullName: newUser.fullName,
			email: newUser.email,
			profilePic: newUser.profilePic,
		});
	} catch (error) {
		console.log("Error in signup ", error.message);
		return res.status(400).json({ message: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		if (!email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (!emailPattern.test(email)) {
			return res.status(400).json({ message: "Invalid email" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(400).json({ message: "Invalid credential" });
		}
		await generateToken(user._id, res);
		return res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			email: user.email,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login ", error.message);
		return res.status(400).json({ message: "Internal Server Error" });
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie("jwt");
		return res.status(200).json({ message: "logout successfully" });
	} catch (error) {
		console.log("Error in logout ", error.message);
		return res.status(400).json({ message: "Internal Server Error" });
	}
};

export const updateProfile = async (req, res) => {
	const { profilePic } = req.file;
	try {
		if (!profilePic) {
			return res.status(400).json({ message: "Profile pic is required" });
		}
		const uploadResponse = await cloudinary.uploader.upload(profilePic);
		const userUpdate = await User.findById(req.user._id)
		user.profilePic= uploadResponse.secure_url
		await user.save()
		return res.status(200).json(userUpdate)
	} catch (error) {
		console.log("Error in updateProfile controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const checkAuth = (req, res) => {
	try {
		res.status(200).json(req.user);
	} catch (error) {
		console.log("Error in checkAuth controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
