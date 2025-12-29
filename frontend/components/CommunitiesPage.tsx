import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Search,
  MessageCircle,
  Users,
  Lock,
  Globe,
  CheckCircle,
  Crown,
  Camera,
  Music,
  Dumbbell,
  Coffee,
  Book,
  Gamepad2,
  Palette,
  Briefcase,
  Heart,
  Star,
  Clock,
  Calendar,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { FullScreenLayout } from "./FullScreenLayout";
import { CommunitiesListItem } from "./CommunitiesListItem";
import type { ConversationItem } from "./CommunitiesListItem";

interface Conversation extends ConversationItem {
  id: string;
  type: "community" | "direct";
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSender?: string;
  unreadCount: number;
  memberCount?: number;
  isPrivate?: boolean;
  isVerified?: boolean;
  category?: string;
  isOnline?: boolean;
  isPinned?: boolean;
  isTyping?: boolean;
  typingMembers?: string[];
  isMeetupCommunity?: boolean;
  meetupDate?: string;
  isDirectMessage?: boolean;
  userStatus?: "online" | "offline" | "away";
  isRequested?: boolean;
}

export function CommunitiesPage() {
  const navigate = useNavigate();
  // Mock conversations data - mix of communities and direct messages
  const mockConversations: Conversation[] = [
    {
      id: "1",
      type: "direct",
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612c294?w=150&h=150&fit=crop&crop=center",
      lastMessage: "Hey! Are you joining the photography meetup tomorrow?",
      lastMessageTime: "2:30 PM",
      unreadCount: 2,
      isOnline: true,
      isPinned: true,
      userStatus: "online",
      isDirectMessage: true,
    },
    {
      id: "2",
      type: "community",
      name: "Downtown Photography Club",
      avatar:
        "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=150&h=150&fit=crop&crop=center",
      lastMessage:
        "Sarah: Let's discuss our upcoming downtown photo walk this weekend.",
      lastMessageTime: "10:30 AM",
      lastMessageSender: "Sarah Chen",
      unreadCount: 3,
      memberCount: 127,
      isPrivate: false,
      isVerified: true,
      category: "photography",
      isOnline: true,
      isPinned: true,
      isRequested: false,
    },
    {
      id: "3",
      type: "direct",
      name: "Mike Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=center",
      lastMessage: "Thanks for the workout tips! Really helped.",
      lastMessageTime: "11:45 AM",
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
      userStatus: "offline",
      isDirectMessage: true,
    },
    {
      id: "4",
      type: "community",
      name: "Morning Yoga Session",
      avatar:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&h=150&fit=crop&crop=center",
      lastMessage: "Reminder: Session starts at 7 AM tomorrow. See you there!",
      lastMessageTime: "11:15 AM",
      lastMessageSender: "System",
      unreadCount: 1,
      memberCount: 12,
      isPrivate: false,
      isVerified: false,
      category: "fitness",
      isOnline: true,
      isPinned: false,
      isMeetupCommunity: true,
      meetupDate: "Tomorrow, 7:00 AM",
    },
    {
      id: "5",
      type: "direct",
      name: "Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=center",
      lastMessage: "Let me know when you're free to chat about the project",
      lastMessageTime: "9:20 AM",
      unreadCount: 0,
      isOnline: true,
      isPinned: false,
      userStatus: "away",
      isDirectMessage: true,
      isTyping: true,
    },
    {
      id: "6",
      type: "community",
      name: "Fitness Enthusiasts",
      avatar:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center",
      lastMessage: "Mike: Anyone up for a morning run tomorrow?",
      lastMessageTime: "9:45 AM",
      lastMessageSender: "Mike Rodriguez",
      unreadCount: 1,
      memberCount: 89,
      isPrivate: false,
      isVerified: false,
      category: "fitness",
      isOnline: true,
      isPinned: false,
    },
    {
      id: "7",
      type: "community",
      name: "Jazz Lovers Society",
      avatar:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=center",
      lastMessage: "Tonight's jazz session was incredible! Thanks everyone.",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      memberCount: 45,
      isPrivate: true,
      isVerified: true,
      category: "music",
      isOnline: false,
      isPinned: false,
      isRequested: true,
    },
  ];

  // Sort conversations: pinned first, then by last message time
  const sortedConversations = [...mockConversations].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return 0; // Keep original order for non-pinned items
  });

  const formatTime = (timeStr: string) => {
    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      return timeStr;
    }
    return timeStr;
  };

  const getCategoryIcon = (category?: string) => {
    if (!category) return Users;
    const icons: Record<string, any> = {
      photography: Camera,
      music: Music,
      fitness: Dumbbell,
      food: Coffee,
      learning: Book,
      gaming: Gamepad2,
      arts: Palette,
      business: Briefcase,
      social: Heart,
    };
    return icons[category] || Star;
  };

  const handleConversationClick = (conversationId: string) => {
    navigate("/chat-detail");
  };

  const handleSearchClick = () => {
    // Navigate to community search/discovery page
    navigate(ROUTES.CHAT_GROUPS);
  };

  const getUserStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-green-500";
    }
  };

  return (
    <FullScreenLayout
      title="Communities"
      onClose={() => navigate(ROUTES.COMMUNITIES)}
    >
      <div
        className="h-full flex flex-col bg-white"
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Communities</h1>
                <p className="text-sm text-gray-500">Your conversations</p>
              </div>
            </div>

            <Button
              onClick={() => navigate(ROUTES.CREATE_CHAT_GROUP)}
              className="rounded-full w-10 h-10 p-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar - Clickable to open discovery */}
          <div className="relative">
            <button onClick={handleSearchClick} className="w-full text-left">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search communities and people..."
                  className="pl-10 rounded-full border-gray-200 bg-gray-50 cursor-pointer"
                  readOnly
                />
              </div>
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {sortedConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <MessageCircle className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No conversations yet</p>
              <p className="text-sm">
                Start a conversation or join a community
              </p>
              <Button onClick={handleSearchClick} className="mt-4 rounded-xl">
                <Search className="h-4 w-4 mr-2" />
                Find Communities
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sortedConversations.map((conversation) => (
                <CommunitiesListItem
                  key={conversation.id}
                  conversation={conversation}
                  onClick={handleConversationClick}
                  getCategoryIcon={getCategoryIcon}
                  getUserStatusColor={getUserStatusColor}
                  formatTime={formatTime}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </FullScreenLayout>
  );
}
