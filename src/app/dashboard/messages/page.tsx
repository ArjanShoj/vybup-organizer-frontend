'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Search, 
  Users, 
  Clock,
  ArrowLeft,
  Send,
  Archive,
  MoreVertical,
  Music,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { apiClient } from '@/lib/api';
import { ChatSummaryDto, PageResponse, MessageDto, GigResponse } from '@/types/api';
import { toast } from 'sonner';

// Individual chat item component
const ChatItem = ({ 
  chat, 
  isSelected, 
  onClick, 
  gigDetails 
}: {
  chat: ChatSummaryDto;
  isSelected: boolean;
  onClick: () => void;
  gigDetails?: GigResponse;
}) => {
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
            <div className="h-full w-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
              P
            </div>
          </Avatar>
          {chat.unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">
                {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold truncate ${
                chat.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
              }`}>
                Performer Chat
              </h3>
              {!chat.isActive && (
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500">
                  Archived
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500 ml-2 shrink-0">
              {formatTime(chat.lastMessageAt)}
            </span>
          </div>
          
          {gigDetails && (
            <div className="flex items-center gap-2 mb-2">
              <Music className="h-3 w-3 text-gray-400" />
              <span className="text-sm text-gray-600 truncate">
                {gigDetails.title}
              </span>
            </div>
          )}
          
          <p className={`text-sm truncate ${
            chat.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
          }`}>
            {chat.lastMessageContent || 'No messages yet'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Chat view component
const ChatView = ({ 
  chatId, 
  onBack 
}: {
  chatId: string;
  onBack: () => void;
}) => {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [gigDetails, setGigDetails] = useState<GigResponse | null>(null);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const [messagesResponse, chatResponse] = await Promise.allSettled([
        apiClient.getMessages(chatId),
        apiClient.getChat(chatId)
      ]);

      if (messagesResponse.status === 'fulfilled') {
        const pageData = messagesResponse.value as PageResponse<MessageDto>;
        setMessages(pageData.content || []);
      }

      if (chatResponse.status === 'fulfilled') {
        const chatData = chatResponse.value as any;
        if (chatData.gigId) {
          try {
            const gigResponse = await apiClient.getGigDetails(chatData.gigId) as GigResponse;
            setGigDetails(gigResponse);
          } catch (error) {
            console.error('Error fetching gig details:', error);
          }
        }
      }

      // Mark messages as read
      await apiClient.markMessagesAsRead(chatId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      const message = await apiClient.sendMessage(chatId, newMessage.trim()) as MessageDto;
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <div className="h-full w-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
              P
            </div>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Performer Chat</h3>
            {gigDetails && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Music className="h-3 w-3" />
                <span className="truncate">{gigDetails.title}</span>
              </div>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Archive Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isSystemMessage ? 'justify-center' : 'justify-start'}`}
            >
              {message.isSystemMessage ? (
                <div className="bg-gray-100 px-3 py-2 rounded-full text-sm text-gray-600">
                  {message.content}
                </div>
              ) : (
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <p className="text-gray-900">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(message.sentAt)}
                      </span>
                      {message.status === 'READ' && (
                        <CheckCircle2 className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button type="submit" disabled={!newMessage.trim() || isSending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

const MessagesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [chats, setChats] = useState<ChatSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [gigDetailsMap, setGigDetailsMap] = useState<{ [gigId: string]: GigResponse }>({});

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getChats() as PageResponse<ChatSummaryDto>;
      const chatList = response.content || [];
      setChats(chatList);

      // Fetch gig details for all chats
      const gigIds = [...new Set(chatList.map(chat => chat.gigId))];
      const gigDetailsPromises = gigIds.map(async (gigId) => {
        try {
          const gigDetails = await apiClient.getGigDetails(gigId) as GigResponse;
          return { gigId, gigDetails };
        } catch (error) {
          console.error(`Error fetching gig details for ${gigId}:`, error);
          return null;
        }
      });

      const gigDetailsResults = await Promise.allSettled(gigDetailsPromises);
      const newGigDetailsMap: { [gigId: string]: GigResponse } = {};
      
      gigDetailsResults.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          newGigDetailsMap[result.value.gigId] = result.value.gigDetails;
        }
      });
      
      setGigDetailsMap(newGigDetailsMap);

      // Set initial chat from URL params
      const gigId = searchParams?.get('gigId');
      if (gigId && chatList.length > 0) {
        const chat = chatList.find(c => c.gigId === gigId);
        if (chat) {
          setSelectedChatId(chat.id);
        }
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    const gigDetails = gigDetailsMap[chat.gigId];
    return (
      (chat.lastMessageContent?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (gigDetails?.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Communicate with your hired performers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Chat List */}
            <div className={`${selectedChatId ? 'hidden lg:block' : 'block'} lg:col-span-1`}>
              <Card className="h-full border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      Conversations
                    </CardTitle>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {chats.length}
                    </Badge>
                  </div>
                  
                  {/* Search */}
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="p-0 overflow-y-auto">
                  {filteredChats.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-500 mb-2">
                        {chats.length === 0 ? 'No conversations yet' : 'No matching conversations'}
                      </p>
                      <p className="text-gray-400">
                        {chats.length === 0 
                          ? 'Conversations will appear here when you accept performer applications.'
                          : 'Try adjusting your search terms.'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {filteredChats.map((chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          isSelected={selectedChatId === chat.id}
                          onClick={() => setSelectedChatId(chat.id)}
                          gigDetails={gigDetailsMap[chat.gigId]}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat View */}
            <div className={`${selectedChatId ? 'block' : 'hidden lg:block'} lg:col-span-2`}>
              <Card className="h-full border-0 shadow-lg">
                {selectedChatId ? (
                  <ChatView 
                    chatId={selectedChatId} 
                    onBack={() => setSelectedChatId(null)}
                  />
                ) : (
                  <CardContent className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-500 mb-2">
                        Select a conversation
                      </p>
                      <p className="text-gray-400">
                        Choose a conversation from the list to start chatting
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;