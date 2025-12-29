import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Share2, Copy, CheckCircle, Facebook, Twitter, Linkedin, MessageCircle, Send, Instagram, X } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  title: string;
  description: string;
  url?: string;
  type: 'meetup' | 'notice' | 'service' | 'profile';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export function ShareButton({ 
  title, 
  description, 
  url = window.location.href, 
  type, 
  size = 'sm',
  variant = 'outline',
  className = '' 
}: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `${title}\n\n${description}\n\nCheck it out on LocalityBay: ${url}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodedText}`,
      available: true
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      available: true
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedDescription}`,
      available: true
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      available: true
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      available: true
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      url: '',
      available: false, // Instagram doesn't support direct URL sharing
      note: 'Instagram sharing requires the mobile app'
    }
  ];

  const handleShare = (shareUrl: string, platform: string) => {
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowModal(false);
      toast.success(`Shared to ${platform}!`);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
        toast.success('Shared successfully!');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      setShowModal(true);
    }
  };

  const getTypeEmoji = () => {
    switch (type) {
      case 'meetup': return '📅';
      case 'notice': return '📢';
      case 'service': return '💼';
      case 'profile': return '👤';
      default: return '🔗';
    }
  };

  const getTypeText = () => {
    switch (type) {
      case 'meetup': return 'meetup';
      case 'notice': return 'notice';
      case 'service': return 'service';
      case 'profile': return 'profile';
      default: return 'content';
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size === 'md' ? 'default' : size}
        onClick={handleNativeShare}
        className={`transition-all duration-200 ${className}`}
      >
        <Share2 className="h-4 w-4 mr-1" />
        <span>Share</span>
      </Button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md mx-4 card-enhanced card-cream animate-scale-in">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Share2 className="h-5 w-5 text-blue-600" />
                  <span>Share {getTypeText()}</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Content Preview */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <span className="text-lg">{getTypeEmoji()}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">{title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
                  </div>
                </div>
              </div>

              {/* Copy Link */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Share Link</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-2 bg-gray-50 rounded-lg border text-sm text-gray-600 truncate">
                    {url}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className={`px-3 transition-all duration-200 ${copied ? 'bg-green-50 border-green-300 text-green-700' : ''}`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Social Share Options */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Share on Social Media</label>
                <div className="grid grid-cols-2 gap-2">
                  {shareOptions.map((option) => (
                    <Button
                      key={option.name}
                      variant="outline"
                      onClick={() => option.available ? handleShare(option.url, option.name) : null}
                      disabled={!option.available}
                      className={`flex items-center justify-start space-x-2 p-3 rounded-xl transition-all duration-200 ${
                        option.available 
                          ? `${option.color} text-white border-none hover:scale-105` 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <option.icon className="h-4 w-4" />
                      <span className="font-medium">{option.name}</span>
                    </Button>
                  ))}
                </div>
                
                {/* Instagram Note */}
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  <span className="font-medium">Note:</span> Instagram sharing works best through the mobile app. 
                  Copy the link and paste it in your Instagram story or post.
                </div>
              </div>

              {/* Direct Share (Mobile) */}
              {typeof navigator.share === 'function' && (
                <div className="pt-2 border-t border-gray-200">
                  <Button
                    onClick={handleNativeShare}
                    className="w-full rounded-xl"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Use Device Share Menu
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}