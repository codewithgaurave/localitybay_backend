import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  ArrowLeft,
  Search,
  MessageSquare,
  Phone,
  Star,
  Shield,
  MoreVertical,
  Send,
  Paperclip,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ServiceMessagesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");

  const serviceConversations = [
    {
      id: "SC001",
      provider: {
        name: "Mike Johnson",
        service: "Plumbing Services",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        verified: true,
        rating: 4.8,
      },
      lastMessage: "I can come by tomorrow at 2 PM to fix the leak.",
      timestamp: "5 min ago",
      unread: 2,
      messages: [
        {
          id: 1,
          sender: "user",
          content: "Hi, I have a leaking pipe in my kitchen. Can you help?",
          timestamp: "10:30 AM",
        },
        {
          id: 2,
          sender: "provider",
          content:
            "Hello! Yes, I can definitely help with that. When would be a good time for you?",
          timestamp: "10:35 AM",
        },
        {
          id: 3,
          sender: "user",
          content: "Tomorrow afternoon would work best for me.",
          timestamp: "10:40 AM",
        },
        {
          id: 4,
          sender: "provider",
          content: "I can come by tomorrow at 2 PM to fix the leak.",
          timestamp: "10:45 AM",
        },
      ],
    },
    {
      id: "SC002",
      provider: {
        name: "Sarah Photography",
        service: "Wedding Photography",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b5b65b75?w=100&h=100&fit=crop&crop=face",
        verified: true,
        rating: 4.9,
      },
      lastMessage: "Here are some sample photos from similar events.",
      timestamp: "2 hours ago",
      unread: 0,
      messages: [
        {
          id: 1,
          sender: "user",
          content:
            "Hi Sarah, I'm getting married next month and would love to see your portfolio.",
          timestamp: "8:20 AM",
        },
        {
          id: 2,
          sender: "provider",
          content: "Congratulations! I'd be happy to share my work with you.",
          timestamp: "8:25 AM",
        },
        {
          id: 3,
          sender: "provider",
          content: "Here are some sample photos from similar events.",
          timestamp: "8:30 AM",
        },
      ],
    },
    {
      id: "SC003",
      provider: {
        name: "David Tech Solutions",
        service: "Computer Repair",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        verified: false,
        rating: 4.6,
      },
      lastMessage:
        "The diagnostic will cost ₹500, repair depends on the issue.",
      timestamp: "1 day ago",
      unread: 1,
      messages: [
        {
          id: 1,
          sender: "user",
          content: "My laptop won't turn on. Can you take a look?",
          timestamp: "Yesterday 3:15 PM",
        },
        {
          id: 2,
          sender: "provider",
          content: "Sure! I can diagnose the issue for you.",
          timestamp: "Yesterday 3:20 PM",
        },
        {
          id: 3,
          sender: "provider",
          content:
            "The diagnostic will cost ₹500, repair depends on the issue.",
          timestamp: "Yesterday 3:25 PM",
        },
      ],
    },
  ];

  const filteredConversations = serviceConversations.filter(
    (conv) =>
      conv.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.provider.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = serviceConversations.find(
    (conv) => conv.id === selectedConversation
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConv) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  if (selectedConversation && selectedConv) {
    return (
      <div
        className="min-h-screen bg-white flex flex-col"
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      >
        {/* Chat Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversation(null)}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={selectedConv.provider.avatar}
                  alt={selectedConv.provider.name}
                />
                <AvatarFallback>{selectedConv.provider.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">
                    {selectedConv.provider.name}
                  </h3>
                  {selectedConv.provider.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {selectedConv.provider.service}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedConv.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <Paperclip className="h-5 w-5" />
            </Button>

            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.SERVICES)}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                Service Messages
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="divide-y divide-gray-200">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            onClick={() => setSelectedConversation(conversation.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={conversation.provider.avatar}
                    alt={conversation.provider.name}
                  />
                  <AvatarFallback>
                    {conversation.provider.name[0]}
                  </AvatarFallback>
                </Avatar>
                {conversation.provider.verified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.provider.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">
                        {conversation.provider.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp}
                    </span>
                    {conversation.unread > 0 && (
                      <div className="h-5 w-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-1">
                  {conversation.provider.service}
                </p>
                <p className="text-sm text-gray-800 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredConversations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center mb-6">
            <MessageSquare className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            No service conversations
          </h3>
          <p className="text-gray-500 text-center max-w-sm">
            Start chatting with service providers by contacting them from the
            Services page.
          </p>
          <Button
            onClick={() => navigate(ROUTES.SERVICES)}
            className="mt-6 btn-gradient px-6 py-3"
          >
            Browse Services
          </Button>
        </div>
      )}
    </div>
  );
}
