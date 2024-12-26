import { create } from "zustand";
import toaster from "react-hot-toast";
import { io } from "socket.io-client";

import { axiosInstance } from "../utils/axios.js";

const Base_Url = import.meta.env.VITE_SERVER_URI;

export const useAuthStore = create((set, get) => ({
	authUser: null,
	isSigningUp: false,
	isLoggingIn: false,
	isLoggingOut: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,

	onlineUsers: [],
	socket: null,

	checkAuth: async () => {
		try {
			set({ authUser: null });
			const res = await axiosInstance.get("/auth/check-auth");
			get().connectSocket();
			set({ authUser: res.data });
		} catch (error) {
			console.log("Error in checkAuth : ", error);
			toaster.error(error.response.data.message);
			set({ authUser: null });
		} finally {
			set({ isCheckingAuth: false });
		}
	},

	signup: async (data) => {
		try {
			set({ isSigningUp: true });
			const res = await axiosInstance.post("/auth/signup", data);
			get().connectSocket();
			toaster.success("account created successfully");
			set({ authUser: res.data });
		} catch (error) {
			console.log("Error in signup : ", error);
			toaster.error(error.response.data.message);
			set({ authUser: null });
		} finally {
			set({ isSigningUp: false });
		}
	},

	login: async (data) => {
		try {
			set({ isLoggingIn: true });
			const res = await axiosInstance.post("auth/login", data);
			toaster.success("login successfully");
			set({ authUser: res.data });
			get().connectSocket();
		} catch (error) {
			console.log("Error in login : ", error);
			toaster.error(error.response.data.message);
			set({ authUser: null });
		} finally {
			set({ isLoggingIn: false });
		}
	},

	logout: async () => {
		try {
			set({ isLoggingOut: true });
			const res = await axiosInstance.post("/auth/logout");
			get().disconnectSocket();
			toaster.success(res.data.message);
			set({ authUser: null });
		} catch (error) {
			console.log("Error in logout : ", error);
			toaster.error(error.response.data.message);
		} finally {
			set({ isLoggingOut: false });
		}
	},

	updateProfile: async (data) => {
		try {
			set({ isUpdatingProfile: true });
			const res = await axiosInstance.post("/auth/update-profile", data);
			toaster.success("profile updated");
			set({ isUpdatingProfile: false, authUser: res.data });
		} catch (error) {
			console.log("Error in updateProfile : ", error);
			toaster.error(error.response.data.message);
			set({ isUpdatingProfile: false });
		}
	},

	connectSocket: async () => {
		const { authUser } = get();
		if (!authUser) {
			return;
		}
		const socket = await io(Base_Url, {
			query: { userId: authUser._id },
		});
		socket.connect();

		socket.on("getOnileUsers", (userIds) => {
			set({ onlineUsers: userIds });
		});

		set({ socket: socket });
	},
	disconnectSocket: () => {
		if (get().socket?.connected) {
			console.log("disconnectSocket", get().socket?.connected);
			get().socket.disconnect();
		}
	},
}));
