import { create } from "zustand";
import toaster from "react-hot-toast";

import { axiosInstance } from "../utils/axios.js";

export const useAuthStore = create((set) => ({
	authUser: null,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,

	onlineUsers: [],

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth/check-auth");
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
			const res = await axiosInstance.post("/auth/logout");
			toaster.success(res.data.message);
			set({ authUser: null });
		} catch (error) {
			console.log("Error in logout : ", error);
			toaster.error(error.response.data.message);
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
}));
