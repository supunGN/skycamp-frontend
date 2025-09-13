import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowPathIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";

const mockMessages = [
  {
    id: 1,
    sender: "Supun Gunathilake",
    message: "Hello everyone! Welcome to our Horton Plains adventure!",
    timestamp: "10:30 AM",
    isCurrentUser: false,
    profilePicture: null
  },
  {
    id: 2,
    sender: "Isini Sandunika",
    message: "Hello, Nice to meet ya! Looking forward to this trip!",
    timestamp: "10:32 AM",
    isCurrentUser: true,
    profilePicture: null
  },
  {
    id: 3,
    sender: "Supun Gunathilake",
    message: "Looking forward to the hike! The weather forecast looks perfect for tomorrow.",
    timestamp: "10:35 AM",
    isCurrentUser: false,
    profilePicture: null
  },
  {
    id: 4,
    sender: "Isini Sandunika",
    message: "Same here! What time should we meet at the entrance?",
    timestamp: "10:36 AM",
    isCurrentUser: true,
    profilePicture: null
  },
  {
    id: 5,
    sender: "Supun Gunathilake",
    message: "Let's meet at 6 AM at the entrance. Don't forget to bring warm clothes!",
    timestamp: "10:38 AM",
    isCurrentUser: false,
    profilePicture: null
  },
  {
    id: 6,
    sender: "Kamal Perera",
    message: "I'll be there! Should I bring my camera equipment?",
    timestamp: "10:40 AM",
    isCurrentUser: false,
    profilePicture: null
  },
  {
    id: 7,
    sender: "Isini Sandunika",
    message: "Yes, definitely bring your camera! The sunrise views are supposed to be amazing.",
    timestamp: "10:42 AM",
    isCurrentUser: true,
    profilePicture: null
  },
  {
    id: 8,
    sender: "Supun Gunathilake",
    message: "Absolutely! We'll have plenty of photo opportunities. The World's End viewpoint is spectacular.",
    timestamp: "10:45 AM",
    isCurrentUser: false,
    profilePicture: null
  },
  {
    id: 9,
    sender: "Tharindu Silva",
    message: "What about food? Should we pack lunch?",
    timestamp: "10:47 AM",
    isCurrentUser: false,
    profilePicture: null
  },
  {
    id: 10,
    sender: "Isini Sandunika",
    message: "Good question! I think we should pack some snacks and water. The hike is quite long.",
    timestamp: "10:50 AM",
    isCurrentUser: true,
    profilePicture: null
  },
  {
    id: 11,
    sender: "Supun Gunathilake",
    message: "Yes, definitely pack snacks and at least 2 liters of water per person. The trail is challenging.",
    timestamp: "10:52 AM",
    isCurrentUser: false,
    profilePicture: null
  },
  {
    id: 12,
    sender: "Kamal Perera",
    message: "I'll bring extra water bottles for everyone. Safety first!",
    timestamp: "10:55 AM",
    isCurrentUser: false,
    profilePicture: null
  },
  {
    id: 13,
    sender: "Isini Sandunika",
    message: "That's so thoughtful of you Kamal! Thank you!",
    timestamp: "10:57 AM",
    isCurrentUser: true,
    profilePicture: null
  },
  {
    id: 14,
    sender: "Supun Gunathilake",
    message: "Great team spirit! Remember to wear comfortable hiking boots and bring a rain jacket just in case.",
    timestamp: "11:00 AM",
    isCurrentUser: false,
    profilePicture: null
  },
  {
    id: 15,
    sender: "Tharindu Silva",
    message: "Got it! I'm so excited for this adventure. It's going to be an amazing experience!",
    timestamp: "11:05 AM",
    isCurrentUser: false,
    profilePicture: null
  }
];

export default function IndividualChatView({ chat, onBack }) {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "You", // Current user
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
        profilePicture: null
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image file (JPG, PNG, WebP, or GIF)");
        return;
      }
      
      if (file.size > maxSize) {
        alert("File size must be less than 10MB");
        return;
      }

      // Create a message with the uploaded image
      const imageUrl = URL.createObjectURL(file);
      const message = {
        id: messages.length + 1,
        sender: "You",
        message: "",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
        profilePicture: null,
        image: imageUrl,
        fileName: file.name
      };
      
      setMessages([...messages, message]);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRefresh = () => {
    // In real implementation, this would fetch latest messages
    console.log("Refreshing messages...");
  };

  return (
    <div className="flex flex-col h-full bg-white min-h-0">
      {/* Header */}
      <div className="relative flex items-center justify-between px-6 py-4 bg-white flex-shrink-0">
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gray-200"></div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
            {chat?.image ? (
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
          <h2 className="text-lg font-semibold text-gray-900">
            {chat?.location} {chat?.endDate}
          </h2>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-3 max-w-md ${message.isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Profile Picture */}
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                {message.profilePicture ? (
                  <img
                    src={message.profilePicture}
                    alt={message.sender}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>

              {/* Message Content */}
              <div className={`flex flex-col ${message.isCurrentUser ? 'items-end' : 'items-start'}`}>
                <div className="text-xs text-gray-600 mb-1">
                  {message.sender}
                </div>
                {message.image ? (
                  <div className="max-w-xs">
                    <img
                      src={message.image}
                      alt={message.fileName || 'Uploaded image'}
                      className="rounded-lg max-w-full h-auto"
                    />
                    {message.message && (
                            <div
                              className={`px-3 py-2 rounded-lg text-sm mt-2 ${
                                message.isCurrentUser
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                        {message.message}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`px-4 py-3 rounded-lg text-sm ${
                      message.isCurrentUser
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.message}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {message.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="relative px-6 py-4 bg-white flex-shrink-0">
        <div className="absolute top-0 left-8 right-8 h-px bg-gray-200"></div>
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleUploadClick}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Upload image or file"
          >
            <PhotoIcon className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
