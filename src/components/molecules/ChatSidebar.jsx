import React, { useState } from "react";
import { 
  XMarkIcon, 
  MagnifyingGlassIcon, 
  ArrowPathIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";
import IndividualChatView from "./IndividualChatView";

const mockChats = [
  {
    id: 1,
    location: "Horton Plains",
    endDate: "17 Oct, 2025",
    participants: ["User A", "User B", "User C", "User D"],
    image: "/src/assets/hero/Slide1.png", // Using existing image from assets
    lastMessage: "Looking forward to the hike!",
    lastMessageTime: "2 hours ago",
    unreadCount: 2
  },
  {
    id: 2,
    location: "Namunukula",
    endDate: "01 Nov, 2025",
    participants: ["User A", "User B", "User C"],
    image: null, // No image uploaded
    lastMessage: "See you at the meeting point",
    lastMessageTime: "1 day ago",
    unreadCount: 0
  },
  {
    id: 3,
    location: "Yala National Park",
    endDate: "31 Dec, 2025",
    participants: ["User A", "User B", "User C", "User D", "User E"],
    image: "/src/assets/hero/slide2.png",
    lastMessage: "Don't forget your camera!",
    lastMessageTime: "3 days ago",
    unreadCount: 1
  },
  {
    id: 4,
    location: "Ella",
    endDate: "02 Jan, 2026",
    participants: ["User A", "User B"],
    image: "/src/assets/hero/slide3.png",
    lastMessage: "Weather looks great!",
    lastMessageTime: "1 week ago",
    unreadCount: 0
  },
  {
    id: 5,
    location: "Belihuloya",
    endDate: "31 Jan, 2025",
    participants: ["User A", "User B", "User C", "User D"],
    image: null,
    lastMessage: "Thanks for the amazing trip!",
    lastMessageTime: "2 weeks ago",
    unreadCount: 0
  },
  {
    id: 6,
    location: "Wilpattu National Park",
    endDate: "07 July 2024",
    participants: ["User A", "User B", "User C", "User D", "User E", "User F", "User G", "User H", "User I", "User J", "User K", "User L", "User M", "User N", "User O"],
    image: "/src/assets/hero/slide4.png",
    lastMessage: "Best camping trip ever!",
    lastMessageTime: "1 month ago",
    unreadCount: 0
  }
];

export default function ChatSidebar({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatView, setShowChatView] = useState(false);

  const filteredChats = mockChats.filter(chat =>
    chat.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setShowChatView(true);
  };

  const handleBackToChatList = () => {
    setShowChatView(false);
    setSelectedChat(null);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Chat Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-[28rem] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {showChatView ? (
          <IndividualChatView 
            chat={selectedChat} 
            onBack={handleBackToChatList}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ArrowPathIcon className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chats"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="p-2">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatClick(chat)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedChat?.id === chat.id ? "bg-cyan-50 border border-cyan-200" : ""
                    }`}
                  >
                    {/* Chat Image */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {chat.image ? (
                        <img
                          src={chat.image}
                          alt={chat.location}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PhotoIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Chat Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {chat.location}
                        </h3>
                        {chat.unreadCount > 0 && (
                          <div className="bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(chat.endDate) < new Date() ? "Ended" : "Ends"}: {chat.endDate}
                      </p>
                      
                      <p className="text-xs text-gray-600 truncate">
                        {chat.lastMessage}
                      </p>
                      
                      <p className="text-xs text-gray-400 mt-1">
                        {chat.lastMessageTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
