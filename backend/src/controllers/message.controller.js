import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../utils/cloudinary.js";
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
		const { text, image } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let imageUrl;
		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}
		const message = await new Message({
			senderId,
			receiverId,
			text,
			image: imageUrl,
		});
		await message.save();

		//todo: socket.io

		return res.status(200).json(message);
	} catch (error) {
		console.log("Error in sendMessages controller ", error.message);
		return res.status(400).json({ message: "Internal Server Error" });
	}
};
