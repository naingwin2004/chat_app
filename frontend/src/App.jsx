import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "lucide-react";

import Main from "./layouts/Main.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SettingPage from "./pages/SettingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { useAuthStore } from "./store/auth.store.js";

const App = () => {
	const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth && !authUser) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<Loader className='size-10 animate-spin' />
			</div>
		);
	}

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Main />,
			children: [
				{
					index: true,
					element: authUser ? <HomePage /> : <Navigate to='/login' />,
				},
				{
					path: "/login",
					element: !authUser ? <LoginPage /> : <Navigate to='/' />,
				},
				{
					path: "/signup",
					element: !authUser ? <SignupPage /> : <Navigate to='/' />,
				},
				{ path: "/settings", element: <SettingPage /> },
				{
					path: "/profile",
					element: authUser ? (
						<ProfilePage />
					) : (
						<Navigate to='/login' />
					),
				},
			],
		},
	]);
	return <RouterProvider router={router} />;
};

export default App;
