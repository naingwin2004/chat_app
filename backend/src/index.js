import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { app, server } from "./utils/socket.js";
import { connectDB } from "./utils/db.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

app.use(express.json()); // req.body => parse json data
app.use(cookieParser()); // parse to cookie
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "development"
				? "http://localhost:5173"
				: process.env.SERVER_URI,
		credentials: true,
	}),
);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
	});
}

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

server.listen(PORT, () => {
	console.log(`server is running on port : ${PORT}`);
	connectDB();
});
