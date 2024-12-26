import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axios.js";
import { useAuthStore } from "./auth.store.js";

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isSendingLoading: false,
	isMessagesLoading: false,
	isDeleteMessageLoading: false,

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			const res = await axiosInstance.get("/messages/users");
			set({ users: res.data });
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		} finally {
			set({ isUsersLoading: false });
		}
	},

	getMessages: async (userId) => {
		set({ isMessagesLoading: true });
		try {
			const res = await axiosInstance.get(`/messages/${userId}`);
			set({ messages: res.data });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isMessagesLoading: false });
		}
	},
	sendMessage: async (messageData) => {
		const { selectedUser, messages } = get();
		try {
			set({ isSendingLoading: true });
			const res = await axiosInstance.post(
				`/messages/send/${selectedUser._id}`,
				messageData,
			);
			set({ messages: [...messages, res.data] });
		} catch (error) {
			toast.error(error.response.data.message);
			console.log("Error in sendMessage", error);
		} finally {
			set({ isSendingLoading: false });
		}
	},
	deleteMessage: async (messageId) => {
		try {
			set({ isDeleteMessageLoading: true });
			const res = await axiosInstance.post(
				`/messages/message/${messageId}`,
			);
			{
				/*
			// i don't wanna use this because performance is down
			const {selectedUser,getMessages} = get()
			if(selectedUser._id){
			  getMessages(selectedUser._id)
			toast.success(res.data.message);
			}*/
			}
			set((state) => ({
				messages: state.messages.filter(
					(message) => message._id !== messageId,
				),
			}));
			toast.success(res.data.message);
		} catch (error) {
			console.log("Error in deleteMessage", error);
			toast.error(error.response.data.message);
		} finally {
			set({ isDeleteMessageLoading: false });
		}
	},

	subscribeToMessages: () => {
		const { selectedUser } = get();
		if (!selectedUser) return;

		const socket = useAuthStore.getState().socket;
		const logout = useAuthStore.getState().logout;

		if (!socket) {
			logout();
			return toast.error("Somthin went wrong!");
		}

		socket.on("newMessage", (newMessage) => {
			if (newMessage.senderId !== selectedUser._id) return;
			set({
				messages: [...get().messages, newMessage],
			});
		});

		socket.on("deletedMessage", (deletedMessageId) => {
			set((state) => ({
				messages: state.messages.filter(
					(message) => message._id !== deletedMessageId,
				),
			}));
		});
	},

	unsubscribeFromMessages: () => {
		const socket = useAuthStore.getState().socket;
		const logout = useAuthStore.getState().logout;
		if (!socket) {
			logout();
			return toast.error("Somthin went wrong!");
		}
		socket.off("newMessage");
	},

	setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
