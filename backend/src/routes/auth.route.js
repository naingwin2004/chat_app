import express from "express";

import {
	signup,
	login,
	logout,
	updateProfile,
	checkAuth,
} from "../controllers/auth.controller.js";
import { productRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/update-profile", productRoute, updateProfile);
router.post("/check-auth",productRoute, checkAuth);

export default router;
