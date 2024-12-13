import { useEffect } from "react";

import { useChatStore } from "../store/chat.store.js";
import ChatHeader from "../components/ChatHeader.jsx";
import MessageInput from "../components/MessageInput.jsx";
import MessageShowCase from "../components/MessageShowCase.jsx";
import MessageSkeleton from "../components/skeletons/MessageSkeleton.jsx";

const ChatContainer = () => {
	const { getMessages, selectedUser, isMessagesLoading } = useChatStore();
	
	useEffect(() => {
		getMessages(selectedUser._id);
	}, [getMessages, selectedUser._id]);

	if (isMessagesLoading) {
		return (
			<div className='flex flex-col flex-1 overflow-auto'>
				<ChatHeader />
				<MessageSkeleton />
				<MessageInput />
			</div>
		);
	}
	return (
		<div className='flex flex-col flex-1 overflow-auto'>
			<ChatHeader />

			<MessageShowCase />

			<MessageInput />
		</div>
	);
};

export default ChatContainer;
