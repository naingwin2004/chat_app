import { useEffect, useRef } from "react";
import { Trash } from "lucide-react";
import { formatISO9075 } from "date-fns";

import { useAuthStore } from "../store/auth.store.js";
import { useChatStore } from "../store/chat.store.js";

const MessageShowCase = () => {
	const messageEndRef = useRef(null);
	const { authUser } = useAuthStore();
	const { messages, selectedUser, deleteMessage, isDeleteMessageLoading } =
		useChatStore();

	const handleDeleteMessage = (messageId) => {
		deleteMessage(messageId);
	};

	useEffect(() => {
		if (messageEndRef.current && messages) {
			messageEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	if (messages.length === 0) {
		return (
			<div className='flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4'>
				<p className='font-bold text-center'>
					Start a new conversation!
				</p>
			</div>
		);
	}
	return (
		<div className='flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4'>
			{messages.map((message) => (
				<div
					key={message._id}
					ref={messageEndRef}
					onClick={() =>
						document.getElementById(message._id).showModal()
					}
					className={`chat ${
						message.senderId === authUser._id
							? "chat-end"
							: "chat-start"
					}`}>
					<div className='chat-header mb-1'>
						<time className='text-xs opacity-50 ml-1'>
							{formatISO9075(new Date(message.createdAt))}
						</time>
					</div>
					<div className='chat-bubble flex flex-col justify-center'>
						{message.image && (
							<img
								src={message.image}
								alt='Attachment'
								className='max-w-[200px] rounded-md mb-2 object-center'
							/>
						)}
						{message.text && <p>{message.text}</p>}
					</div>
					{/* Open the modal using document.getElementById('ID').showModal() method */}
					<dialog
						id={message._id}
						className='modal'>
						<div className='modal-box'>
							<h3 className='font-bold text-lg'>
								To : {selectedUser.fullName}
							</h3>
							{message.text && (
								<p className='py-4 font-bold'>
									Message : {message.text}
								</p>
							)}
							<div className='flex justify-center'>
								{message.image && (
									<img
										src={message.image}
										alt='Attachment'
										className='max-h-[300px] rounded-md my-2'
									/>
								)}
							</div>
							
							{message.senderId === authUser._id && 							<div className='flex justify-end'>
								<button
									disabled={isDeleteMessageLoading}
									className='btn bg-red-700 text-base-300 rounded-md'
									onClick={() =>
										handleDeleteMessage(message._id)
									}>
									<Trash className='size-5' />
									{isDeleteMessageLoading
										? "deleting..."
										: "Delete message"}
								</button>
							</div>}
						</div>
						<form
							method='dialog'
							className='modal-backdrop'>
							<button>close</button>
						</form>
					</dialog>
				</div>
			))}
		</div>
	);
};

export default MessageShowCase;
