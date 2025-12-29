import React, { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  X,
  Navigation,
  Shield,
  Crown,
  MapPin,
  Users,
  Clock,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { SimpleMap } from "./SimpleMap";

interface User {
  id: number;
  userId: string;
  name: string;
  age: number;
  distance: string;
  status: "online" | "offline";
  photo: string;
  interests: string[];
  verified: boolean;
  premium: boolean;
  bio?: string;
  profession?: string;
  location?: string;
  joinDate?: string;
  mutualFriends?: number;
  rating?: number;
  badges?: string[];
}

interface FullScreenMapProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onUserClick: (user: User) => void;
  location: string;
}

export function FullScreenMap({
  isOpen,
  onClose,
  users,
  onUserClick,
  location,
}: FullScreenMapProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    onUserClick(user);
  };

  const getUserOutlineClasses = (user: User) => {
    if (user.verified && user.premium) {
      return "ring-1 ring-gradient-to-r ring-from-blue-400 ring-to-yellow-400 border-2 border-white shadow-lg shadow-blue-300/20";
    } else if (user.verified) {
      return "ring-1 ring-blue-400 border-2 border-white shadow-lg shadow-blue-300/20";
    } else if (user.premium) {
      return "ring-1 ring-yellow-400 border-2 border-white shadow-lg shadow-yellow-300/20";
    }
    return "border-2 border-white shadow-lg ring-1 ring-blue-200";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 m-0 rounded-none">
        <DialogHeader className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center shadow-md">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-800">
                  Interactive Map
                </DialogTitle>
                <p className="text-sm text-gray-600">{location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 border-blue-200"
              >
                {users.length} users nearby
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-lg"
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="relative w-full h-full bg-gray-100 overflow-hidden">
          <SimpleMap
            users={users}
            onUserClick={handleUserClick}
            location={location}
            isFullScreen={true}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
