import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "../components/Navbar.jsx";
import { useThemeStore } from "../store/theme.store.js";

const Main = () => {
	const { theme } = useThemeStore();
	return (
		<div data-theme={theme}>
			<Navbar />
			<Outlet />
			<Toaster />
		</div>
	);
};

export default Main;
