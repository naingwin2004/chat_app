import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./utils/db.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";

const PORT = process.env.PORT || 8000;

dotenv.config();
const app = express();

app.use(express.json()); // req.body => parse json data
app.use(cookieParser()); // parse to cookie

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

app.listen(PORT, () => {
	console.log(`server is running on port : ${PORT}`);
	connectDB();
});
