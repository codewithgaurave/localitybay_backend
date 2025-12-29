import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  EyeOff,
  User,
  Bell,
  Smartphone,
  Globe,
  Heart,
  Moon,
  Sun,
  Trash2,
  Download,
  Upload,
  HelpCircle,
  LogOut,
  Crown,
  MapPin,
  MessageSquare,
  Calendar,
  Settings,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";



export function SettingsPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mock user settings
  const [settings, setSettings] = useState({
    // Privacy settings
    profileVisibility: "public", // public, friends, private
    showOnMap: true,
    hideFromMap: false, // Premium feature
    allowMessages: "everyone", // everyone, friends, verified
    showLocation: true,
    showAge: true,
    showInterests: true,

    // Notification settings
    pushNotifications: true,
    emailNotifications: false,
    meetupReminders: true,
    messageNotifications: true,
    communityUpdates: false,
    marketingEmails: false,

    // Security settings
    twoFactor: false,
    loginAlerts: true,
    deviceTracking: true,

    // General settings
    darkMode: false,
    language: "en",
    currency: "INR",
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Quick Settings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="card-enhanced card-cream">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full p-2 flex-shrink-0">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm">Privacy & Security</h3>
                <p className="text-xs text-muted-foreground">
                  Manage who can see your profile
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced card-cream">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-2 flex-shrink-0">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <p className="text-xs text-muted-foreground">
                  Control your notification preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced card-cream">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-2 flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm">Account Settings</h3>
                <p className="text-xs text-muted-foreground">
                  Manage your account preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced card-cream">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-2 flex-shrink-0">
                <Download className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm">Data & Export</h3>
                <p className="text-xs text-muted-foreground">
                  Download or delete your data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Features */}
      <Card className="card-enhanced border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Crown className="h-4 w-4 text-yellow-600" />
            <span>Premium Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium text-sm">Hide from Map</Label>
              <p className="text-xs text-muted-foreground">
                Stay invisible on the community map
              </p>
            </div>
            <Switch
              checked={settings.hideFromMap}
              disabled={true}
              className="opacity-50"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium text-sm">
                Advanced Privacy Controls
              </Label>
              <p className="text-xs text-muted-foreground">
                Granular control over your visibility
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              Premium
            </Badge>
          </div>
          <Button className="btn-gradient bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 w-full text-sm">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium - ₹200/month
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-4">
      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Profile Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm">Who can see your profile?</Label>
            <div className="space-y-2">
              {[
                {
                  value: "public",
                  label: "Everyone",
                  desc: "Anyone on Social City",
                },
                {
                  value: "friends",
                  label: "Friends Only",
                  desc: "People in your communities",
                },
                {
                  value: "private",
                  label: "Private",
                  desc: "Only you can see your profile",
                },
              ].map((option) => (
                <div key={option.value} className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id={option.value}
                    name="visibility"
                    value={option.value}
                    checked={settings.profileVisibility === option.value}
                    onChange={(e) =>
                      updateSetting("profileVisibility", e.target.value)
                    }
                    className="w-4 h-4 mt-0.5"
                  />
                  <div className="min-w-0">
                    <Label
                      htmlFor={option.value}
                      className="font-medium cursor-pointer text-sm"
                    >
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {option.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <MapPin className="h-4 w-4" />
            <span>Map & Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">
                Show on Community Map
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow others to see you on the local map
              </p>
            </div>
            <Switch
              checked={settings.showOnMap}
              onCheckedChange={(checked: boolean) =>
                updateSetting("showOnMap", checked)
              }
            />
          </div>

          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">
                Show Location Details
              </Label>
              <p className="text-xs text-muted-foreground">
                Display your area/city on profile
              </p>
            </div>
            <Switch
              checked={settings.showLocation}
              onCheckedChange={(checked: boolean) =>
                updateSetting("showLocation", checked)
              }
            />
          </div>

          <div className="flex items-start justify-between opacity-50">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">Hide from Map</Label>
              <p className="text-xs text-muted-foreground">
                Premium: Completely invisible on map
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                Premium
              </Badge>
              <Switch checked={false} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <MessageSquare className="h-4 w-4" />
            <span>Messages & Communication</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm">Who can send you messages?</Label>
            <div className="space-y-2">
              {[
                {
                  value: "everyone",
                  label: "Everyone",
                  desc: "Any Social City user",
                },
                {
                  value: "friends",
                  label: "Community Members",
                  desc: "People in your communities only",
                },
                {
                  value: "verified",
                  label: "Verified Users Only",
                  desc: "Only verified users can message you",
                },
              ].map((option) => (
                <div key={option.value} className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id={`messages-${option.value}`}
                    name="messages"
                    value={option.value}
                    checked={settings.allowMessages === option.value}
                    onChange={(e) =>
                      updateSetting("allowMessages", e.target.value)
                    }
                    className="w-4 h-4 mt-0.5"
                  />
                  <div className="min-w-0">
                    <Label
                      htmlFor={`messages-${option.value}`}
                      className="font-medium cursor-pointer text-sm"
                    >
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {option.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">Show Age</Label>
              <p className="text-xs text-muted-foreground">
                Display your age on your profile
              </p>
            </div>
            <Switch
              checked={settings.showAge}
              onCheckedChange={(checked: boolean) =>
                updateSetting("showAge", checked)
              }
            />
          </div>

          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">Show Interests</Label>
              <p className="text-xs text-muted-foreground">
                Display your interests and hobbies
              </p>
            </div>
            <Switch
              checked={settings.showInterests}
              onCheckedChange={(checked: boolean) =>
                updateSetting("showInterests", checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-4">
      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Lock className="h-4 w-4" />
            <span>Change Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="pr-10 text-sm"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="pr-10 text-sm"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="pr-10 text-sm"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button className="btn-gradient w-full text-sm">
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">Enable 2FA</Label>
              <p className="text-xs text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={settings.twoFactor}
              onCheckedChange={(checked: boolean) =>
                updateSetting("twoFactor", checked)
              }
            />
          </div>

          {settings.twoFactor && (
            <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-sm">Setup Authenticator App</h4>
              <p className="text-xs text-muted-foreground">
                Use apps like Google Authenticator or Authy to generate
                verification codes.
              </p>
              <Button variant="outline" size="sm" className="text-xs">
                Configure 2FA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Security Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">Login Alerts</Label>
              <p className="text-xs text-muted-foreground">
                Get notified of new logins to your account
              </p>
            </div>
            <Switch
              checked={settings.loginAlerts}
              onCheckedChange={(checked: boolean) =>
                updateSetting("loginAlerts", checked)
              }
            />
          </div>

          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">Device Tracking</Label>
              <p className="text-xs text-muted-foreground">
                Monitor devices that access your account
              </p>
            </div>
            <Switch
              checked={settings.deviceTracking}
              onCheckedChange={(checked: boolean) =>
                updateSetting("deviceTracking", checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Smartphone className="h-4 w-4" />
            <span>Push Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">
                Enable Push Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive notifications on your device
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked: boolean) =>
                updateSetting("pushNotifications", checked)
              }
            />
          </div>

          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">
                Message Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Get notified when you receive messages
              </p>
            </div>
            <Switch
              checked={settings.messageNotifications}
              onCheckedChange={(checked: boolean) =>
                updateSetting("messageNotifications", checked)
              }
              disabled={!settings.pushNotifications}
            />
          </div>

          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">Meetup Reminders</Label>
              <p className="text-xs text-muted-foreground">
                Reminders for upcoming meetups
              </p>
            </div>
            <Switch
              checked={settings.meetupReminders}
              onCheckedChange={(checked: boolean) =>
                updateSetting("meetupReminders", checked)
              }
              disabled={!settings.pushNotifications}
            />
          </div>

          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">Community Updates</Label>
              <p className="text-xs text-muted-foreground">
                Updates from your joined communities
              </p>
            </div>
            <Switch
              checked={settings.communityUpdates}
              onCheckedChange={(checked: boolean) =>
                updateSetting("communityUpdates", checked)
              }
              disabled={!settings.pushNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">Email Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked: boolean) =>
                updateSetting("emailNotifications", checked)
              }
            />
          </div>

          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">Marketing Emails</Label>
              <p className="text-xs text-muted-foreground">
                Promotional emails and feature updates
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked: boolean) =>
                updateSetting("marketingEmails", checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-4">
      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">General Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-3">
              <Label className="font-medium text-sm">Dark Mode</Label>
              <p className="text-xs text-muted-foreground">
                Switch to dark theme
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-3 w-3" />
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked: boolean) =>
                  updateSetting("darkMode", checked)
                }
              />
              <Moon className="h-3 w-3" />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-sm">Language</Label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting("language", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Currency</Label>
            <select
              value={settings.currency}
              onChange={(e) => updateSetting("currency", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="INR">₹ Indian Rupee (INR)</option>
              <option value="USD">$ US Dollar (USD)</option>
              <option value="EUR">€ Euro (EUR)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced card-cream border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-600 text-base">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm">Deactivate Account</h4>
              <p className="text-xs text-muted-foreground">
                Temporarily deactivate your account. You can reactivate anytime
                by logging in.
              </p>
              <Button
                variant="outline"
                className="mt-2 text-orange-600 border-orange-600 hover:bg-orange-50 text-sm"
              >
                Deactivate Account
              </Button>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium text-red-600 text-sm">
                Delete Account
              </h4>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <Button className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm">
                <Trash2 className="h-3 w-3 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderData = () => (
    <div className="space-y-4">
      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Download className="h-4 w-4" />
            <span>Export Your Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Download a copy of your Social City data including profile
            information, messages, and activity history.
          </p>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="profile-data"
                defaultChecked
                className="w-4 h-4"
              />
              <Label htmlFor="profile-data" className="text-sm">
                Profile Information
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="messages-data"
                defaultChecked
                className="w-4 h-4"
              />
              <Label htmlFor="messages-data" className="text-sm">
                Messages & Conversations
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="meetups-data"
                defaultChecked
                className="w-4 h-4"
              />
              <Label htmlFor="meetups-data" className="text-sm">
                Meetups & Events
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="photos-data" className="w-4 h-4" />
              <Label htmlFor="photos-data" className="text-sm">
                Photos & Media
              </Label>
            </div>
          </div>

          <Button className="btn-gradient w-full text-sm">
            <Download className="h-4 w-4 mr-2" />
            Request Data Export
          </Button>

          <p className="text-xs text-muted-foreground">
            You'll receive an email with your data within 48 hours.
          </p>
        </CardContent>
      </Card>

      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Data Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Photos Uploaded</span>
              <Badge variant="secondary" className="text-xs">
                24 files
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Messages Sent</span>
              <Badge variant="secondary" className="text-xs">
                1,247
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Meetups Created</span>
              <Badge variant="secondary" className="text-xs">
                8 events
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Account Created</span>
              <Badge variant="secondary" className="text-xs">
                March 2024
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-4">
      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <HelpCircle className="h-4 w-4" />
            <span>Get Help</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto p-3 flex flex-col items-start space-y-1 text-left"
            >
              <h4 className="font-medium text-sm">Help Center</h4>
              <p className="text-xs text-muted-foreground">
                Find answers to common questions
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-3 flex flex-col items-start space-y-1 text-left"
            >
              <h4 className="font-medium text-sm">Contact Support</h4>
              <p className="text-xs text-muted-foreground">
                Get in touch with our team
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-3 flex flex-col items-start space-y-1 text-left"
            >
              <h4 className="font-medium text-sm">Feature Requests</h4>
              <p className="text-xs text-muted-foreground">
                Suggest new features
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-3 flex flex-col items-start space-y-1 text-left"
            >
              <h4 className="font-medium text-sm">Report Bug</h4>
              <p className="text-xs text-muted-foreground">
                Report technical issues
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced card-cream">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">About Social City</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-base font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Social City
            </h3>
            <p className="text-xs text-muted-foreground">Version 2.1.0</p>
            <p className="text-xs text-muted-foreground">
              © 2024 Social City. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs">
            <button className="text-blue-600 hover:underline">
              Privacy Policy
            </button>
            <button className="text-blue-600 hover:underline">
              Terms of Service
            </button>
            <button className="text-blue-600 hover:underline">
              Community Guidelines
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div
      className="relative min-h-screen"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Content overlay */}
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-20 backdrop-blur-lg border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/home")}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-bold">Settings</h1>
            </div>
          </div>
        </div>

        {/* Mobile-First Tabs Layout */}
        <div className="px-4 py-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
              <TabsTrigger
                value="overview"
                className="text-xs data-[state=active]:card-cream"
              >
                <Globe className="h-3 w-3 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="text-xs data-[state=active]:card-cream"
              >
                <Shield className="h-3 w-3 mr-1" />
                Privacy
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="text-xs data-[state=active]:card-cream"
              >
                <Lock className="h-3 w-3 mr-1" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="text-xs data-[state=active]:card-cream"
              >
                <Bell className="h-3 w-3 mr-1" />
                Alerts
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="text-xs data-[state=active]:card-cream"
              >
                <User className="h-3 w-3 mr-1" />
                Account
              </TabsTrigger>
              <TabsTrigger
                value="help"
                className="text-xs data-[state=active]:card-cream"
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                Help
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="animate-fade-in">
              {renderOverview()}
            </TabsContent>

            <TabsContent value="privacy" className="animate-fade-in">
              {renderPrivacy()}
            </TabsContent>

            <TabsContent value="security" className="animate-fade-in">
              {renderSecurity()}
            </TabsContent>

            <TabsContent value="notifications" className="animate-fade-in">
              {renderNotifications()}
            </TabsContent>

            <TabsContent value="account" className="animate-fade-in">
              {renderAccount()}
            </TabsContent>

            <TabsContent value="help" className="animate-fade-in">
              {renderHelp()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
