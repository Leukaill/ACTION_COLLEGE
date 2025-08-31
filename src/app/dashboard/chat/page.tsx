
"use client"

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  MessageCircle, 
  Users, 
  Phone, 
  Video, 
  Plus, 
  Send, 
  Paperclip, 
  FileText, 
  Download,
  Search, 
  MoreVertical, 
  UserPlus, 
  Settings, 
  Crown, 
  Lock, 
  Mic, 
  MicOff,
  VideoOff,
  PhoneOff,
  Volume2,
  X,
  Globe,
  Camera,
  Smile,
  ArrowLeft,
  Info,
  Check
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';


// Mock Data
const mockChats = [
  {
    id: 1,
    type: "group",
    name: "Computer Science - Class of 2024",
    avatar: "https://placehold.co/40x40.png",
    avatarHint: "group study",
    participants: 47,
    lastMessage: "Does anyone have the notes for the math class?",
    lastMessageTime: "14:30",
    unreadCount: 3,
    isAdmin: true,
    admins: [1, 2, 3],
    isPrivate: false
  },
  {
    id: 2,
    type: "direct",
    name: "Marie Lambert",
    avatar: "https://placehold.co/40x40.png",
    avatarHint: "woman portrait",
    lastMessage: "Thanks for your help!",
    lastMessageTime: "13:45",
    unreadCount: 0,
    status: "online"
  },
  {
    id: 3,
    type: "group",
    name: "Final Project - Team A",
    avatar: "https://placehold.co/40x40.png",
    avatarHint: "team collaboration",
    participants: 5,
    lastMessage: "Meeting tomorrow at 9am in room 204",
    lastMessageTime: "12:15",
    unreadCount: 1,
    isAdmin: false,
    admins: [4],
    isPrivate: true
  }
];

const mockMessages = [
  {
    id: 1,
    senderId: 2,
    senderName: "Marie Lambert",
    senderAvatar: "https://placehold.co/32x32.png",
    senderAvatarHint: "woman portrait",
    message: "Hi everyone! Does anyone have the notes from yesterday's math class?",
    timestamp: "14:30",
    type: "text",
    isRead: true
  },
  {
    id: 2,
    senderId: 1,
    senderName: "Jean Dupont",
    senderAvatar: "https://placehold.co/32x32.png",
    senderAvatarHint: "man portrait",
    message: "Yes, I have them! I'll share them now.",
    timestamp: "14:32",
    type: "text",
    isRead: true
  },
  {
    id: 3,
    senderId: 1,
    senderName: "Jean Dupont",
    senderAvatar: "https://placehold.co/32x32.png",
    senderAvatarHint: "man portrait",
    message: "",
    timestamp: "14:33",
    type: "file",
    fileName: "Math_Course_Chap5.pdf",
    fileSize: "2.4 MB",
    fileType: "pdf",
    isRead: true
  },
  {
    id: 4,
    senderId: 3,
    senderName: "Paul Martin",
    senderAvatar: "https://placehold.co/32x32.png",
    senderAvatarHint: "man face",
    message: "Perfect! Thanks a lot 🙏",
    timestamp: "14:35",
    type: "text",
    isRead: false
  }
];

// Main Chat Component
export default function StudentChatPage() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [callConfig, setCallConfig] = useState({ video: false, muted: false, participants: [] as string[] });
  const [showChatList, setShowChatList] = useState(true);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = {
    id: 1, // This would come from the auth context in a real app
    name: user?.displayName || "Current User",
    avatar: user?.photoURL || "https://placehold.co/40x40.png",
    avatarHint: "user avatar",
    status: "online",
    role: "student"
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderAvatarHint: currentUser.avatarHint,
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: "text" as "text",
      isRead: false,
      fileName: "",
      fileSize: "",
      fileType: "",
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const message = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderAvatarHint: currentUser.avatarHint,
      message: "",
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: "file" as "file",
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      fileType: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'document',
      isRead: false
    };

    setMessages(prev => [...prev, message]);
  };

  const startCall = (isVideo = false) => {
    setIsCallActive(true);
    setCallConfig({
      video: isVideo,
      muted: false,
      participants: selectedChat.type === 'group' ? 
        [currentUser.name, "Marie Lambert", "Paul Martin"] : 
        [currentUser.name, selectedChat.name]
    });
  };

  const CallInterface = () => (
    <div className="absolute inset-0 bg-gray-900 z-50 flex flex-col">
      <div className="bg-black bg-opacity-50 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{selectedChat.name}</h3>
            <p className="text-sm text-gray-300">
              {callConfig.video ? "Video Call" : "Audio Call"} • {callConfig.participants.length} participants
            </p>
          </div>
          <Button 
              onClick={() => setIsCallActive(false)}
              variant="destructive" size="icon" className="rounded-full"
            >
              <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 relative">
        {callConfig.video ? (
          <div className="grid grid-cols-2 gap-2 p-4 h-full">
            {callConfig.participants.map((participant, index) => (
              <div key={index} className="bg-gray-800 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-medium">{participant}</p>
                  {participant === currentUser.name && <p className="text-sm text-gray-300">You</p>}
                </div>
                 <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                   <Avatar className="w-20 h-20">
                    <AvatarFallback className="text-2xl bg-primary">{participant.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                   </Avatar>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white">
               <Avatar className="w-32 h-32 mx-auto mb-4">
                 <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} data-ai-hint={selectedChat.avatarHint} />
                 <AvatarFallback className="text-5xl bg-primary">{selectedChat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
               </Avatar>
              <h3 className="text-2xl font-semibold mb-2">{selectedChat.name}</h3>
              <p className="text-gray-300">Call in progress...</p>
            </div>
          </div>
        )}
      </div>
      <div className="bg-black bg-opacity-50 p-6">
        <div className="flex items-center justify-center space-x-4">
          <Button 
            onClick={() => setCallConfig(prev => ({ ...prev, muted: !prev.muted }))}
            variant={callConfig.muted ? 'destructive' : 'secondary'} size="icon"
            className="w-16 h-16 rounded-full"
          >
            {callConfig.muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
          
          {callConfig.video && (
            <Button variant="secondary" size="icon" className="w-16 h-16 rounded-full">
              <VideoOff className="w-6 h-6" />
            </Button>
          )}
          
          <Button 
            onClick={() => setIsCallActive(false)}
            variant="destructive" size="icon"
             className="w-16 h-16 rounded-full"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
          
          <Button variant="secondary" size="icon" className="w-16 h-16 rounded-full">
            <Volume2 className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );

  const CreateGroupModal = () => (
    <div className="absolute inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Create a Group</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowCreateGroup(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
              <Input type="text" placeholder="e.g., Final Project - Team B" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea rows={3} placeholder="Group description..."/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group Type</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="groupType" value="public" className="mr-3" defaultChecked />
                  <Globe className="w-4 h-4 mr-2 text-green-600" />
                  <span>Public - Visible to all students</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="groupType" value="private" className="mr-3" />
                  <Lock className="w-4 h-4 mr-2 text-orange-600" />
                  <span>Private - Invite only</span>
                </label>
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateGroup(false)}>Cancel</Button>
              <Button className="flex-1">Create Group</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="h-screen bg-muted/20 flex relative overflow-hidden">
      <div className={cn('w-full md:w-80 lg:w-96 bg-background border-r border-border flex-col', showChatList ? 'flex' : 'hidden', 'md:flex')}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setShowCreateGroup(true)} variant="ghost" size="icon" title="Create a group">
                <Plus className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockChats
            .filter(chat => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((chat) => (
            <div
              key={chat.id}
              onClick={() => { setSelectedChat(chat); setShowChatList(false);}}
              className={cn('p-3 border-b border-border/50 hover:bg-muted cursor-pointer', selectedChat.id === chat.id && 'bg-primary/10 border-r-4 border-primary')}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                    <AvatarImage src={chat.avatar} alt={chat.name} data-ai-hint={chat.avatarHint} />
                    <AvatarFallback>{chat.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold truncate">{chat.name}</h3>
                      {chat.isAdmin && <Crown className="w-4 h-4 text-yellow-500" />}
                      {chat.isPrivate && <Lock className="w-3 h-3 text-muted-foreground" />}
                    </div>
                    <span className="text-xs text-muted-foreground">{chat.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    {chat.unreadCount > 0 && <Badge variant="default">{chat.unreadCount}</Badge>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cn("flex-1 flex-col bg-background", showChatList ? 'hidden' : 'flex', 'md:flex')}>
        <div className="bg-background border-b p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button onClick={() => setShowChatList(true)} variant="ghost" size="icon" className="md:hidden"><ArrowLeft className="w-5 h-5" /></Button>
              <Avatar><AvatarImage src={selectedChat.avatar} alt={selectedChat.name} data-ai-hint={selectedChat.avatarHint} /></Avatar>
              <div>
                <h3 className="font-semibold">{selectedChat.name}</h3>
                {selectedChat.type === 'group' ? 
                  <p className="text-sm text-muted-foreground">{selectedChat.participants} participants</p> : 
                  <p className="text-sm text-green-500">Online</p>
                }
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button onClick={() => startCall(false)} variant="ghost" size="icon" title="Audio Call"><Phone className="w-5 h-5" /></Button>
              <Button onClick={() => startCall(true)} variant="ghost" size="icon" title="Video Call"><Video className="w-5 h-5" /></Button>
              <Button onClick={() => setShowGroupInfo(!showGroupInfo)} variant="ghost" size="icon"><Info className="w-5 h-5" /></Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex items-end gap-2", message.senderId === currentUser.id ? 'justify-end' : 'justify-start')}>
                {message.senderId !== currentUser.id && <Avatar className="h-8 w-8"><AvatarImage src={message.senderAvatar} alt={message.senderName} data-ai-hint={message.senderAvatarHint}/></Avatar>}
                <div className={cn("rounded-2xl px-4 py-2 max-w-xs lg:max-w-md", message.senderId === currentUser.id ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                  {message.senderId !== currentUser.id && selectedChat.type === 'group' && (
                    <p className="text-xs text-muted-foreground font-bold mb-1">{message.senderName}</p>
                  )}
                  {message.type === 'text' && <p className="text-sm break-words">{message.message}</p>}
                  {message.type === 'file' && (
                    <div className="flex items-center gap-3 p-2">
                        <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                            {message.fileType === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
                            {message.fileType === 'image' && <Camera className="w-5 h-5 text-green-500" />}
                            {message.fileType === 'document' && <FileText className="w-5 h-5 text-blue-500" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{message.fileName}</p>
                            <p className="text-xs text-muted-foreground">{message.fileSize}</p>
                        </div>
                        <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1 text-right">{message.timestamp}</p>
                </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-background border-t p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="w-5 h-5" /></Button>
            <div className="flex-1">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                placeholder="Type a message..."
                rows={1}
                className="w-full rounded-2xl resize-none"
              />
            </div>
            <Button onClick={sendMessage} disabled={!newMessage.trim()} size="icon" className="rounded-full shrink-0"><Send className="w-5 h-5" /></Button>
          </div>
        </div>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
      </div>

      {showGroupInfo && (
        <div className="w-80 bg-background border-l p-4 overflow-y-auto hidden lg:block">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-lg">Group Info</h3>
             <Button variant="ghost" size="icon" onClick={() => setShowGroupInfo(false)}><X className="w-5 h-5"/></Button>
           </div>
          <div className="space-y-6">
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-3">
                <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} data-ai-hint={selectedChat.avatarHint} />
                <AvatarFallback className="text-3xl">{selectedChat.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">{selectedChat.name}</h3>
              {selectedChat.type === 'group' && <p className="text-muted-foreground">{selectedChat.participants} participants</p>}
            </div>
            {selectedChat.type === 'group' && (
              <>
                <div>
                  <h4 className="font-semibold mb-3">Admins</h4>
                  <div className="space-y-2">
                     <div className="flex items-center space-x-3 p-2">
                        <Avatar className="w-8 h-8"><AvatarImage src={currentUser.avatar} alt={currentUser.name} data-ai-hint={currentUser.avatarHint}/></Avatar>
                        <span className="flex-1">{currentUser.name}</span>
                        <Crown className="w-4 h-4 text-yellow-500" />
                      </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Participants</h4>
                    {selectedChat.isAdmin && <Button variant="ghost" size="icon"><UserPlus className="w-4 h-4" /></Button>}
                  </div>
                  <div className="space-y-2">
                    {["Marie Lambert", "Paul Martin", "Sophie Dubois", "Luc Moreau"].map((name, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg">
                        <Avatar className="w-8 h-8"><AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                        <span className="flex-1">{name}</span>
                        {selectedChat.isAdmin && <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {isCallActive && <CallInterface />}
      {showCreateGroup && <CreateGroupModal />}
    </div>
  );
}

