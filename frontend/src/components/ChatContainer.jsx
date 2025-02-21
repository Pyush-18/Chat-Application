import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unSubscribeFromMessages
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageRef = useRef(null)
  useEffect(() => {
    getMessages(selectedUser?._id);
    subscribeToMessages();

    return () => unSubscribeFromMessages();
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if(messageRef.current && messages){
      messageRef.current.scrollIntoView({behavior: "smooth"})
    }
  },[messages])

  if (isMessagesLoading)
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((msg) => (
          <div
            className={`chat ${
              msg?.senderId === authUser?._id ? "chat-end" : "chat-start"
            }`}
            key={msg?._id}
            ref={messageRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    msg?.senderId === authUser?._id
                      ? authUser?.profilePic
                      : selectedUser?.profilePic
                  }
                  alt="profile"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(msg?.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {msg?.image && (
                <img
                  src={msg.image}
                  alt="attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {msg?.text && <p>{msg?.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
