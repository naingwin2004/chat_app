import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

import { useAuthStore } from "../store/auth.store.js";

const Navbar = () => {
	const { logout, authUser } = useAuthStore();

	return (
		<div className='navbar fixed top-0 z-50 bg-base-100 shadow'>
			<div className='flex-1'>
				<div className='flex items-center gap-8 px-3'>
					<Link
						to='/'
						className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
						<MessageSquare className='w-5 h-5 text-primary' />
						<h1 className='text-lg font-bold'>Chatty</h1>
					</Link>
				</div>
			</div>
			<div className='flex-none'>
				<div className='flex items-center gap-2'>
					<Link
						to={"/settings"}
						className={`
              btn btn-sm gap-2 transition-colors
              `}>
						<Settings className='w-4 h-4' />
						<span className='hidden sm:inline'>Settings</span>
					</Link>

					{authUser && (
						<>
							<Link
								to={"/profile"}
								className={`btn btn-sm gap-2`}>
								<User className='size-5' />
								<span className='hidden sm:inline'>
									Profile
								</span>
							</Link>

							<button
								className='btn btn-sm flex gap-2 items-center'
								onClick={logout}>
								<LogOut className='size-5' />
								<span className='hidden sm:inline'>Logout</span>
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
