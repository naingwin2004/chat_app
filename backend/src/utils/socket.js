import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URI,
	},
});

//store to onile usersId
const userSocketMap = {};

io.on("connection", (socket) => {
	console.log("A user connected", socket.id);

	const userId = socket.handshake.query.userId;

	//send to userId =>key as socket.id => value
	if (userId) userSocketMap[userId] = socket.id;
	io.emit("getOnileUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		console.log("A user disconnect", socket.id);

		delete userSocketMap[userId];
	});
});

export function getReceiverSocketId(userId) {
	return userSocketMap[userId];
}

export { app, io, server };
