import React, { useState } from "react";
import TravelBuddyNavbar from "../components/organisms/TravelBuddyNavbar";
import IndividualChatView from "../components/molecules/IndividualChatView";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const mockChats = [
  {
    id: 1,
    location: "Horton Plains",
    endDate: "17 Oct, 2025",
    participants: ["User A", "User B", "User C", "User D"],
    image: "/src/assets/hero/Slide1.png",
    lastMessage: "Looking forward to the hike!",
    lastMessageTime: "2 hours ago",
    unreadCount: 2,
  },
  {
    id: 2,
    location: "Namunukula",
    endDate: "01 Nov, 2025",
    participants: ["User A", "User B", "User C"],
    image: null,
    lastMessage: "See you at the meeting point",
    lastMessageTime: "1 day ago",
    unreadCount: 0,
  },
  {
    id: 3,
    location: "Yala National Park",
    endDate: "31 Dec, 2025",
    participants: ["User A", "User B", "User C", "User D", "User E"],
    image: "/src/assets/hero/slide2.png",
    lastMessage: "Don't forget your camera!",
    lastMessageTime: "3 days ago",
    unreadCount: 1,
  },
  {
    id: 4,
    location: "Ella",
    endDate: "02 Jan, 2026",
    participants: ["User A", "User B"],
    image: "/src/assets/hero/slide3.png",
    lastMessage: "Weather looks great!",
    lastMessageTime: "1 week ago",
    unreadCount: 0,
  },
  {
    id: 5,
    location: "Belihuloya",
    endDate: "31 Jan, 2025",
    participants: ["User A", "User B", "User C", "User D"],
    image: null,
    lastMessage: "Thanks for the amazing trip!",
    lastMessageTime: "2 weeks ago",
    unreadCount: 0,
  },
  {
    id: 6,
    location: "Wilpattu National Park",
    endDate: "07 July 2024",
    participants: [
      "User A",
      "User B",
      "User C",
      "User D",
      "User E",
      "User F",
      "User G",
      "User H",
      "User I",
      "User J",
      "User K",
      "User L",
      "User M",
      "User N",
      "User O",
    ],
    image: "/src/assets/hero/slide4.png",
    lastMessage: "Best camping trip ever!",
    lastMessageTime: "1 month ago",
    unreadCount: 0,
  },
  {
    id: 7,
    location: "Sigiriya Rock",
    endDate: "15 Mar, 2025",
    participants: ["User A", "User B", "User C"],
    image: "/src/assets/hero/slide5.png",
    lastMessage: "Amazing sunrise views!",
    lastMessageTime: "2 months ago",
    unreadCount: 0,
  },
  {
    id: 8,
    location: "Mirissa Beach",
    endDate: "20 Apr, 2025",
    participants: ["User A", "User B", "User C", "User D", "User E"],
    image: null,
    lastMessage: "Whale watching was incredible!",
    lastMessageTime: "3 months ago",
    unreadCount: 1,
  },
  {
    id: 9,
    location: "Nuwara Eliya",
    endDate: "10 May, 2025",
    participants: ["User A", "User B"],
    image: "/src/assets/hero/Slide1.png",
    lastMessage: "Tea plantation tour was fantastic",
    lastMessageTime: "4 months ago",
    unreadCount: 0,
  },
  {
    id: 10,
    location: "Adam's Peak",
    endDate: "25 Dec, 2024",
    participants: ["User A", "User B", "User C", "User D", "User E", "User F"],
    image: "/src/assets/hero/slide2.png",
    lastMessage: "Pilgrimage completed successfully!",
    lastMessageTime: "5 months ago",
    unreadCount: 0,
  },
];

export default function ChatPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [filterType, setFilterType] = useState("all"); // "all", "unread"
  const [chats, setChats] = useState(mockChats);

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.location
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || (filterType === "unread" && chat.unreadCount > 0);
    return matchesSearch && matchesFilter;
  });

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    // Mark chat as read when selected
    if (chat.unreadCount > 0) {
      setChats((prevChats) =>
        prevChats.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
      );
    }
  };

  const handleMarkAllAsRead = () => {
    setChats((prevChats) =>
      prevChats.map((chat) => ({ ...chat, unreadCount: 0 }))
    );
  };

  const handleRefreshPosts = () => {
    console.log("Refreshing posts...");
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <TravelBuddyNavbar
        onChatToggle={() => {}}
        onRefresh={handleRefreshPosts}
      />

      <main className="flex-1 pt-24 flex overflow-hidden">
        <div className="flex w-full h-full">
          {/* Left Pane: Chat List */}
          <aside className="w-1/3 bg-white border-r border-gray-200 flex flex-col min-h-0">
            {/* Header */}
            <div className="relative flex items-center justify-between px-6 py-4 flex-shrink-0">
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gray-200"></div>
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ArrowPathIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="relative px-6 py-4 flex-shrink-0">
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gray-200"></div>
              <div className="flex gap-1">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    filterType === "all"
                      ? "bg-cyan-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("unread")}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors relative ${
                    filterType === "unread"
                      ? "bg-cyan-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  Unread
                  {chats.filter((chat) => chat.unreadCount > 0).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chats.filter((chat) => chat.unreadCount > 0).length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Chat List - Independently Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="space-y-0">
                {filteredChats.length > 0 ? (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatClick(chat)}
                      className={`relative flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedChat?.id === chat.id ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="absolute bottom-0 left-6 right-6 h-px bg-gray-200"></div>
                      {/* Chat Image */}
                      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
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
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-semibold text-gray-900 truncate">
                            {chat.location}
                          </h3>
                          {chat.unreadCount > 0 && (
                            <div className="bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {chat.unreadCount}
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mb-1">
                          {new Date(chat.endDate) < new Date()
                            ? "Ended"
                            : "Ends"}
                          : {chat.endDate}
                        </p>

                        <p className="text-sm text-gray-600 truncate mb-1">
                          {chat.lastMessage}
                        </p>

                        <p className="text-xs text-gray-400">
                          {chat.lastMessageTime}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {filterType === "unread"
                        ? "No unread messages"
                        : searchTerm
                        ? "No chats found"
                        : "No messages yet"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {filterType === "unread"
                        ? "All caught up!"
                        : searchTerm
                        ? "Try adjusting your search"
                        : "Start a conversation to see messages here"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right Pane: Individual Chat */}
          <section className="flex-1 bg-white flex flex-col min-h-0">
            {selectedChat ? (
              <IndividualChatView
                chat={selectedChat}
                onBack={() => setSelectedChat(null)}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PhotoIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 text-lg">
                    Choose a chat from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
