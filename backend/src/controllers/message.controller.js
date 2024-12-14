import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId } from "../utils/socket.js";
import { io } from "../utils/socket.js";

export const getUsersForSidebar = async (req, res) => {
	const loginUserId = req.user._id;
	try {
		const userFilter = await User.find({
			_id: { $ne: loginUserId },
		}).select("-password"); // Find all user but not login user
		return res.status(200).json(userFilter);
	} catch (error) {
		console.log("Error in getUsersForSidebar controller ", error.message);
		return res.status(400).json({ message: "Internal Server Error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const message = await Message.find({
			$or: [
				{ receiverId: senderId, senderId: userToChatId },
				{ receiverId: userToChatId, senderId: senderId },
			],
		}); //eg. user(A) to user(B) & user(B) to user(A) : message contain history
		return res.status(200).json(message);
	} catch (error) {
		console.log("Error in getMessages controller ", error.message);
		return res.status(400).json({ message: "Internal Server Error" });
	}
};

export const sendMessages = async (req, res) => {
	try {
		const { text } = req.body;
		const image = req.file;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let imageUrl;
		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image.path);
			imageUrl = uploadResponse.secure_url;
		}
		const message = await new Message({
			senderId,
			receiverId,
			text,
			image: imageUrl,
		});
		await message.save();

		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", message);
		}

		return res.status(200).json(message);
	} catch (error) {
		console.log("Error in sendMessages controller ", error.message);
		return res.status(400).json({ message: "Internal Server Error" });
	}
};

export const deleteMessage = async (req, res) => {
	const { id: messageId } = req.params;
	try {
		const message = await Message.findById(messageId);
		if (!message) {
			return res.status(404).json({ message: "Message not found" });
		}
		// Check if the logged-in user is the sender
		if (message.senderId.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: "You do not have permission to delete this message",
			});
		}

		await Message.findByIdAndDelete(messageId);

		const receiverSocketId = getReceiverSocketId(message.receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("deletedMessage",messageId);
		}

		return res
			.status(200)
			.json({ message: "Message deleted successfully" });
	} catch (error) {
		console.log("Error in deleteMessage controller", error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
