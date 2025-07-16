'use client'

import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Badge } from '@repo/ui/badge';
import { Avatar, AvatarFallback } from '@repo/ui/avatar';
import { Button } from '@repo/ui/button';
import Input from '@repo/ui/input';
import { TooltipProvider } from '@repo/ui/tooltip';
import { 
  MessageSquare, 
  Search, 
  Archive, 
  MoreHorizontal,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trash2,
  Clock
} from 'lucide-react';

interface FeedbackMessage {
  _id: string;
  portalId: string;
  clientEmail: string;
  clientName: string;
  message: string;
  isRead: boolean | string;
  createdAt: string;
}

interface PortalGroup {
  portalId: string;
  clientName: string;
  messages: FeedbackMessage[];
  totalMessages: number;
  unreadCount: number;
  lastMessageTime: string;
}

interface FeedbackInboxProps {
  messages: FeedbackMessage[];
}

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffMs = now.getTime() - messageTime.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return messageTime.toLocaleDateString();
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const FeedbackInbox: React.FC<FeedbackInboxProps> = ({ messages }) => {
  const [selectedPortalId, setSelectedPortalId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');

  const portalGroups = useMemo((): PortalGroup[] => {
    const grouped = messages.reduce((acc, message) => {
      (acc[message.portalId] = acc[message.portalId] || []).push(message);
      return acc;
    }, {} as Record<string, FeedbackMessage[]>);

    return Object.entries(grouped).map(([portalId, portalMessages]) => {
      const sortedMessages = portalMessages.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      const unreadCount = portalMessages.filter(
        msg => msg.isRead === false || msg.isRead === 'false'
      ).length;

      return {
        portalId,
        clientName: portalMessages[0]?.clientName ?? "",
        messages: sortedMessages,
        totalMessages: portalMessages.length,
        unreadCount,
        lastMessageTime: sortedMessages[0]?.createdAt || '',
      };
    }).sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  }, [messages]);

  const filteredPortalGroups = useMemo(() => {
    if (filterMode === 'unread') {
      return portalGroups.filter(group => group.unreadCount > 0);
    }
    return portalGroups;
  }, [portalGroups, filterMode]);

  const selectedPortalMessages = useMemo(() => {
    if (!selectedPortalId) return [];
    return portalGroups.find(group => group.portalId === selectedPortalId)?.messages || [];
  }, [selectedPortalId, portalGroups]);

  const selectedPortal = portalGroups.find(group => group.portalId === selectedPortalId);
  const selectedMessage = selectedPortalMessages[0]; // Show the latest message

  return (
    <TooltipProvider>
      <div className="flex w-full h-full bg-[#0F0F0F]">
        {/* Left Panel - Message List */}
        <div className="w-96 border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-semibold mb-4">Inbox</h1>
            
            {/* Filter Buttons */}
            <div className="flex gap-1 mb-4">
              <Button
                variant={filterMode === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilterMode('all')}
                className="rounded-full"
              >
                All feedback
              </Button>
              <Button
                variant={filterMode === 'unread' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilterMode('unread')}
                className="rounded-full"
              >
                Unread
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-10 bg-muted/50 border-0"
              />
            </div>
          </div>

          {/* Message List */}
          <ScrollArea className="flex-1">
            {filteredPortalGroups.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No feedback messages yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredPortalGroups.map((portal) => {
                  const isSelected = selectedPortalId === portal.portalId;
                  const isUnread = portal.unreadCount > 0;
                  const latestMessage = portal.messages[0];
                  
                  return (
                    <div
                      key={portal.portalId}
                      className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                        isSelected ? 'bg-muted border-r-2 border-r-primary' : ''
                      }`}
                      onClick={() => setSelectedPortalId(portal.portalId)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                            {getInitials(portal.clientName)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-medium text-sm truncate ${isUnread ? 'font-semibold' : ''}`}>
                              {portal.clientName}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(portal.lastMessageTime)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2 truncate">
                            {latestMessage?.message}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            {latestMessage && (
                              <Badge variant="outline" className="text-xs">
                                feedback
                              </Badge>
                            )}
                            {isUnread && (
                              <Badge variant="default" className="text-xs">
                                {portal.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {isUnread && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right Panel - Message Content */}
        <div className="flex-1 flex flex-col">
          {!selectedPortalId ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select a message to view feedback</h3>
                <p className="text-sm">Choose a message from the left to see the content</p>
              </div>
            </div>
          ) : (
            <>
              {/* Message Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon">
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedMessage && (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(selectedMessage.clientName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg">{selectedMessage.clientName}</h2>
                      <p className="text-sm text-muted-foreground">
                        Reply-To: {selectedMessage.clientEmail}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedMessage.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <ScrollArea className="flex-1">
                <div className="p-6">
                  {selectedPortalMessages.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No feedback yet for this portal</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedPortalMessages.map((message) => (
                        <div key={message._id} className="space-y-4">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {message.message}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(message.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(message.isRead === false || message.isRead === 'false') && (
                                <Badge variant="secondary" className="text-xs">
                                  Unread
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default FeedbackInbox;