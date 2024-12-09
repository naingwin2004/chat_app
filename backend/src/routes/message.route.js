import express from "express";

import { getUsersForSidebar,getMessages ,sendMessages} from "../controllers/message.controller.js";
import { productRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users", productRoute, getUsersForSidebar);
router.get("/:id", productRoute, getMessages);
router.get("/send/:id", productRoute, sendMessages);

export default router;
