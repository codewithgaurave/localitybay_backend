import React from "react";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, CheckCircle, Clock, Globe, Lock, Users } from "lucide-react";

export interface ConversationItem {
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
  isRequested?: boolean; // pending membership request
}

type Props = {
  conversation: ConversationItem;
  onClick: (id: string) => void;
  getCategoryIcon: (category?: string) => any;
  getUserStatusColor: (status?: string) => string;
  formatTime: (t: string) => string;
};

export function CommunitiesListItem({
  conversation,
  onClick,
  getCategoryIcon,
  getUserStatusColor,
  formatTime,
}: Props) {
  const CategoryIcon = getCategoryIcon(conversation.category);

  return (
    <button
      onClick={() => onClick(conversation.id)}
      className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex items-center space-x-3"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <ImageWithFallback
            src={conversation.avatar}
            alt={conversation.name}
            className="h-full w-full object-cover"
          />
        </Avatar>

        {/* Status Indicator for Direct Messages */}
        {conversation.isDirectMessage && conversation.userStatus && (
          <div
            className={`absolute -bottom-1 -right-1 h-4 w-4 border-2 border-white rounded-full ${getUserStatusColor(
              conversation.userStatus
            )}`}
          />
        )}

        {/* Online Indicator for Communities */}
        {!conversation.isDirectMessage && conversation.isOnline && (
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
        )}

        {/* Verification Badge */}
        {conversation.isVerified && (
          <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 bg-white text-blue-500 rounded-full" />
        )}
      </div>

      {/* Conversation Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {conversation.name}
            </h3>

            {/* Meetup Community Badge */}
            {conversation.isMeetupCommunity && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Meetup
              </Badge>
            )}

            {/* Requested membership badge */}
            {conversation.type === "community" && conversation.isRequested && (
              <Badge
                variant="outline"
                className="text-xs bg-amber-50 text-amber-700 border-amber-200"
              >
                Requested
              </Badge>
            )}

            {/* Pinned Indicator */}
            {conversation.isPinned && (
              <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
            )}

            {/* Privacy Indicator for Communities */}
            {conversation.type === "community" &&
              (conversation.isPrivate ? (
                <Lock className="h-3 w-3 text-gray-400 flex-shrink-0" />
              ) : (
                <Globe className="h-3 w-3 text-gray-400 flex-shrink-0" />
              ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {formatTime(conversation.lastMessageTime)}
            </span>
            {conversation.unreadCount > 0 && (
              <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
              </div>
            )}
          </div>
        </div>

        {/* Meetup Details */}
        {conversation.isMeetupCommunity && conversation.meetupDate && (
          <div className="flex items-center space-x-1 mb-1">
            <Clock className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-blue-600 font-medium">
              {conversation.meetupDate}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate flex-1">
            {conversation.isTyping ? (
              <span className="text-blue-600 italic">
                {conversation.isDirectMessage
                  ? "typing..."
                  : `${conversation.typingMembers?.[0]} is typing...`}
              </span>
            ) : (
              conversation.lastMessage
            )}
          </p>
        </div>

        {/* Community Info */}
        {conversation.type === "community" && (
          <div className="flex items-center space-x-3 mt-2">
            {conversation.category && (
              <div className="flex items-center space-x-1">
                <CategoryIcon className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500 capitalize">
                  {conversation.category}
                </span>
              </div>
            )}

            {conversation.memberCount && (
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {conversation.memberCount}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
