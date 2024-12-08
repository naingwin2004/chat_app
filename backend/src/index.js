import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./utils/db.js";
import authRoute from "./routes/auth.route.js";

const PORT = process.env.PORT || 8000;

dotenv.config();
const app = express();

app.use(express.json()); // req.body => parse json data
app.use(cookieParser());

app.use("/api/auth", authRoute);

if (process.env.NODE_ENV === "development") {
	console.log("This is the development environment.");
} else if (process.env.NODE_ENV === "production") {
	console.log("This is the production environment.");
} else {
	console.log("Environment not set.");
}

app.listen(PORT, () => {
	console.log(`server is running on port : ${PORT}`);
	connectDB();
});
