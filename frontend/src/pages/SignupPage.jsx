import { useState } from "react";
import toaster from "react-hot-toast";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
	Eye,
	EyeOff,
	Loader2,
	Lock,
	Mail,
	User,
	MessageSquare,
} from "lucide-react";

import { useAuthStore } from "../store/auth.store.js";

const SignupPage = () => {
	const [showPassword, setShowPassword] = useState(false);

	const { signup, isSigningUp } = useAuthStore();
	const { register, handleSubmit } = useForm();

	const handleSubmitSignup = (data) => {
		try{
		signup(data);
		  
		}catch(error){
		  toaster.error("Somthing went wrong!");
			console.log("Error in handleSubmitSignup", error);
		}
	};
	return (
		<div className='min-h-screen flex flex-col justify-center items-center overflow-hidden'>
			<div className='w-full max-w-md mx-3 space-y-6 p-6'>
				<div className='text-center mb-8'>
					<div className='flex flex-col items-center gap-2 group'>
						<div
							className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors'>
							<MessageSquare className='w-6 h-6 text-primary' />
						</div>
						<h1 className='text-2xl font-bold mt-2'>
							Welcome Back
						</h1>
						<p className='text-base-content/60'>
							Sign in to your account
						</p>
					</div>
				</div>

				<form
					onSubmit={handleSubmit(handleSubmitSignup)}
					className='space-y-6'>
					<div className='form-control'>
						<label className='label'>
							<span className='label-text font-medium'>
								FullName
							</span>
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<User className='h-5 w-5 text-base-content' />
							</div>
							<input
								type='text'
								className={`input input-bordered w-full pl-10 placeholder-base-content/40`}
								{...register("fullName")}
								placeholder='Your Name'
							/>
						</div>
					</div>

					<div className='form-control'>
						<label className='label'>
							<span className='label-text font-medium'>
								Email
							</span>
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<Mail className='h-5 w-5 text-base-content' />
							</div>
							<input
								type='email'
								className={`input input-bordered w-full pl-10 placeholder-base-content/40`}
								{...register("email")}
								placeholder='you@example.com'
							/>
						</div>
					</div>

					<div className='form-control'>
						<label className='label'>
							<span className='label-text font-medium'>
								Password
							</span>
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<Lock className='h-5 w-5 text-base-content' />
							</div>
							<input
								type={showPassword ? "text" : "password"}
								className={`input input-bordered w-full pl-10 placeholder-base-content/40`}
								{...register("password")}
								placeholder='your password'
							/>
							<button
								type='button'
								className='absolute inset-y-0 right-0 pr-3 flex items-center'
								onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? (
									<EyeOff className='h-5 w-5 text-base-content' />
								) : (
									<Eye className='h-5 w-5 text-base-content' />
								)}
							</button>
						</div>
					</div>

					<button
						type='submit'
						className='btn btn-primary w-full text-lg'
						disabled={isSigningUp}>
						{isSigningUp ? (
							<>
								<Loader2 className='h-5 w-5 animate-spin' />
								Loading...
							</>
						) : (
							"Sign in"
						)}
					</button>
				</form>

				<div className='text-center'>
					<p className='text-base-content/60'>
						Already have an account?{" "}
						<Link
							to='/login'
							className='link link-primary'>
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignupPage;
