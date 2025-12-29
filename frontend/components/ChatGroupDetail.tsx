import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  ArrowLeft,
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Users,
  Image as ImageIcon,
  Phone,
  Video,
  Info,
  UserPlus,
  Settings,
  Bell,
  BellOff,
  Search,
  Star,
  Archive,
  Trash2,
  Shield,
  Crown,
  CheckCircle,
  X,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  type: "text" | "image" | "system";
  status?: "sent" | "delivered" | "read";
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "member";
  isVerified: boolean;
  isPremium: boolean;
  status: "online" | "offline" | "away";
  lastSeen?: string;
}

export function ChatGroupDetail() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showMessageRequest, setShowMessageRequest] = useState(false);
  const [hasJoined, setHasJoined] = useState(true);
  const [isPrivateGroup, setIsPrivateGroup] = useState(false);
  const [messageRequestSent, setMessageRequestSent] = useState(false);
  const [canSendMessages, setCanSendMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Mock group data
  const groupData = {
    id: "1",
    name: "Downtown Photography Club",
    avatar:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=150&h=150&fit=crop&crop=center",
    description:
      "A community of photography enthusiasts exploring downtown cityscapes and street photography.",
    memberCount: 127,
    isPrivate: false,
    category: "Photography",
    location: "Downtown Toronto",
    createdBy: "Sarah Chen",
    isVerified: true,
  };

  // Mock members data
  const members: GroupMember[] = [
    {
      id: "1",
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b665?w=150&h=150&fit=crop&crop=center",
      role: "admin",
      isVerified: true,
      isPremium: true,
      status: "online",
    },
    {
      id: "2",
      name: "Mike Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=center",
      role: "member",
      isVerified: false,
      isPremium: false,
      status: "online",
    },
    {
      id: "3",
      name: "Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=center",
      role: "member",
      isVerified: true,
      isPremium: false,
      status: "away",
      lastSeen: "2 hours ago",
    },
  ];

  // Mock messages data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Sarah Chen",
      content:
        "Welcome everyone! Let's discuss our upcoming downtown photo walk this weekend.",
      timestamp: "10:30 AM",
      isOwn: false,
      type: "text",
      status: "read",
    },
    {
      id: "2",
      sender: "You",
      content: "Sounds great! What time are we meeting?",
      timestamp: "10:32 AM",
      isOwn: true,
      type: "text",
      status: "read",
    },
    {
      id: "3",
      sender: "Mike Rodriguez",
      content: "I'll bring my new lens to test it out!",
      timestamp: "10:35 AM",
      isOwn: false,
      type: "text",
      status: "delivered",
    },
    {
      id: "4",
      sender: "System",
      content: "Emma Wilson joined the group",
      timestamp: "10:40 AM",
      isOwn: false,
      type: "system",
    },
    {
      id: "5",
      sender: "Emma Wilson",
      content: "Hi everyone! Excited to join this photography community.",
      timestamp: "10:41 AM",
      isOwn: false,
      type: "text",
      status: "delivered",
    },
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Check permissions
    if (!hasJoined && isPrivateGroup) {
      setShowMessageRequest(true);
      return;
    }

    if (!canSendMessages) {
      setShowMessageRequest(true);
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
      type: "text",
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // For first-time message requests (Instagram-style)
    if (!hasJoined) {
      setMessageRequestSent(true);
      setCanSendMessages(false);
    }
  };

  const handleJoinGroup = () => {
    setHasJoined(true);
    setCanSendMessages(true);
    setShowMessageRequest(false);
  };

  const handleSendMessageRequest = () => {
    handleSendMessage();
    setShowMessageRequest(false);
  };

  const renderMessage = (msg: Message) => {
    if (msg.type === "system") {
      return (
        <div key={msg.id} className="flex justify-center mb-4">
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <span className="text-xs text-gray-600">{msg.content}</span>
          </div>
        </div>
      );
    }

    return (
      <div
        key={msg.id}
        className={`flex mb-4 ${msg.isOwn ? "justify-end" : "justify-start"}`}
      >
        {!msg.isOwn && (
          <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1494790108755-2616b612b665?w=150&h=150&fit=crop&crop=center"
              alt={msg.sender}
              className="h-full w-full object-cover"
            />
          </Avatar>
        )}

        <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? "ml-auto" : ""}`}>
          {!msg.isOwn && (
            <div className="flex items-center space-x-1 mb-1">
              <span className="text-xs font-semibold text-gray-700">
                {msg.sender}
              </span>
              {members.find((m) => m.name === msg.sender)?.isVerified && (
                <CheckCircle className="h-3 w-3 text-blue-500" />
              )}
              {members.find((m) => m.name === msg.sender)?.isPremium && (
                <Crown className="h-3 w-3 text-yellow-500" />
              )}
            </div>
          )}

          <div
            className={`px-4 py-2 rounded-2xl ${
              msg.isOwn
                ? "bg-blue-500 text-white rounded-br-md"
                : "bg-gray-100 text-gray-800 rounded-bl-md"
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>

          <div
            className={`flex items-center space-x-1 mt-1 ${
              msg.isOwn ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-xs text-gray-500">{msg.timestamp}</span>
            {msg.isOwn && (
              <div className="flex items-center">
                {msg.status === "sent" && (
                  <span className="text-xs text-gray-400">✓</span>
                )}
                {msg.status === "delivered" && (
                  <span className="text-xs text-gray-400">✓✓</span>
                )}
                {msg.status === "read" && (
                  <span className="text-xs text-blue-400">✓✓</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* WhatsApp-style Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center space-x-3 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.CHAT_GROUPS)}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <button
            onClick={() => setShowGroupInfo(true)}
            className="flex items-center space-x-3 flex-1 hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <ImageWithFallback
                  src={groupData.avatar}
                  alt={groupData.name}
                  className="h-full w-full object-cover"
                />
              </Avatar>
              {groupData.isVerified && (
                <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 bg-white text-blue-500 rounded-full" />
              )}
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {groupData.name}
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                {isTyping
                  ? "Someone is typing..."
                  : `${groupData.memberCount} members`}
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="p-2">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-1">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {!hasJoined && isPrivateGroup ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-3">
              This is a private group. You need to join to send messages.
            </p>
            <Button onClick={handleJoinGroup} className="rounded-xl">
              <UserPlus className="h-4 w-4 mr-2" />
              Request to Join
            </Button>
          </div>
        ) : messageRequestSent && !canSendMessages ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-3">
              Message request sent. Wait for the group admin to accept.
            </p>
            <Button
              variant="outline"
              onClick={() => setCanSendMessages(true)}
              className="rounded-xl"
            >
              Cancel Request
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <Paperclip className="h-5 w-5" />
            </Button>

            <div className="flex-1 flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="border-none bg-transparent focus:ring-0 focus:border-none p-0"
              />
              <Button variant="ghost" size="sm" className="p-1">
                <Smile className="h-5 w-5" />
              </Button>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="rounded-full w-10 h-10 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Group Info Modal */}
      <Dialog open={showGroupInfo} onOpenChange={setShowGroupInfo}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <Avatar className="h-16 w-16">
                <ImageWithFallback
                  src={groupData.avatar}
                  alt={groupData.name}
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <div>
                <DialogTitle className="flex items-center space-x-2">
                  <span>{groupData.name}</span>
                  {groupData.isVerified && (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                </DialogTitle>
                <DialogDescription>
                  {groupData.memberCount} members • {groupData.category}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-600">{groupData.description}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                Location
              </h4>
              <p className="text-sm text-gray-600">{groupData.location}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-3">
                Members ({members.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <ImageWithFallback
                            src={member.avatar}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                            member.status === "online"
                              ? "bg-green-500"
                              : member.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium">
                            {member.name}
                          </span>
                          {member.isVerified && (
                            <CheckCircle className="h-3 w-3 text-blue-500" />
                          )}
                          {member.isPremium && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {member.status === "online"
                            ? "Online"
                            : member.status === "away"
                            ? `Last seen ${member.lastSeen}`
                            : "Offline"}
                        </span>
                      </div>
                    </div>
                    {member.role === "admin" && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-xl">
                  <Bell className="h-4 w-4 mr-2" />
                  Mute
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Request Modal */}
      <Dialog open={showMessageRequest} onOpenChange={setShowMessageRequest}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message Request?</DialogTitle>
            <DialogDescription>
              {isPrivateGroup
                ? "This is a private group. Your message will be sent as a request to the group admin."
                : "This will be your first message to this person. They'll need to accept your request to continue the conversation."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowMessageRequest(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSendMessageRequest}>Send Request</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
