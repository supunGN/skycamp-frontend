import { useState, useEffect, useRef } from "react";
import { API } from "../../api";
import Button from "../atoms/Button";
import {
  Send as SendIcon,
  Loader2 as LoaderIcon,
  User as UserIcon,
  MessageCircle as MessageCircleIcon,
  Users as UsersIcon,
} from "lucide-react";

export default function TravelChat({ planId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [chatMembers, setChatMembers] = useState([]);
  const messagesEndRef = useRef(null);
  const [lastMessageTime, setLastMessageTime] = useState(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages and chat info
  useEffect(() => {
    if (planId) {
      loadMessages();
      loadChatInfo();
      // Set up polling for new messages
      const interval = setInterval(loadNewMessages, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [planId]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await API.travelBuddy.listMessages({ plan_id: planId });
      setMessages(response.data.messages || []);
      setError(null);
    } catch (err) {
      console.error("Error loading messages:", err);
      setError("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const loadNewMessages = async () => {
    try {
      const response = await API.travelBuddy.listMessages({ plan_id: planId });
      const newMessages = response.data.messages || [];

      // Check if there are new messages
      if (newMessages.length > messages.length) {
        setMessages(newMessages);
      }
    } catch (err) {
      console.error("Error loading new messages:", err);
    }
  };

  const loadChatInfo = async () => {
    try {
      const response = await API.travelBuddy.getPlan(planId);
      if (response.data.chat) {
        setChatMembers(response.data.chat.member_count || 0);
      }
    } catch (err) {
      console.error("Error loading chat info:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      await API.travelBuddy.sendMessage({
        plan_id: planId,
        message: newMessage.trim(),
      });

      setNewMessage("");
      // Reload messages to get the new one
      loadMessages();
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoaderIcon className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-600" />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageCircleIcon className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-red-600 mb-2">{error}</p>
          <Button onClick={loadMessages} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageCircleIcon className="w-5 h-5 text-cyan-600" />
          <h3 className="font-medium text-gray-900">Travel Plan Chat</h3>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <UsersIcon className="w-4 h-4" />
          <span>{chatMembers} members</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircleIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.message.sender_id === currentUserId;

            return (
              <div
                key={msg.message.message_id}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex space-x-2 max-w-xs lg:max-w-md ${
                    isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isOwnMessage ? "bg-cyan-600" : "bg-gray-200"
                    }`}
                  >
                    <UserIcon
                      className={`w-4 h-4 ${
                        isOwnMessage ? "text-white" : "text-gray-600"
                      }`}
                    />
                  </div>

                  {/* Message */}
                  <div
                    className={`flex flex-col ${
                      isOwnMessage ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg ${
                        isOwnMessage
                          ? "bg-cyan-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.message.message}</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                      <span>
                        {msg.sender.first_name} {msg.sender.last_name}
                      </span>
                      <span>•</span>
                      <span>{formatMessageTime(msg.message.sent_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            maxLength={1000}
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            size="sm"
            className="px-3"
          >
            {isSending ? (
              <LoaderIcon className="w-4 h-4 animate-spin" />
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-1">
          {newMessage.length}/1000 characters
        </p>
      </div>
    </div>
  );
}
