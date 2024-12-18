import express from "express";

import {
	getUsersForSidebar,
	getMessages,
	sendMessages,
	deleteMessage,
} from "../controllers/message.controller.js";
import { productRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/users", productRoute, getUsersForSidebar);
router.get("/:id", productRoute, getMessages);
router.post("/send/:id", productRoute, upload.single("image"), sendMessages);
router.post("/message/:id",productRoute, deleteMessage);

export default router;
