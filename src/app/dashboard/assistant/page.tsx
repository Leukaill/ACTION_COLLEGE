"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getCampusInfoStream } from "@/ai/flows/ai-assistant-campus-info";
import { generatePresentation, Presentation } from "@/ai/flows/presentation-generator";
import { Bot, Loader2, Send, User, Mic, Square, FileText, MessageSquare, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { speechToText } from "@/ai/flows/speech-to-text";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState("presentation");

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b shrink-0 bg-card">
        <h1 className="text-xl md:text-2xl font-bold font-headline">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">Your creative partner for campus tasks.</p>
      </header>
       <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 self-start">
          <TabsTrigger value="presentation"><Wand2 className="mr-2 h-4 w-4" /> Presentation Generator</TabsTrigger>
          <TabsTrigger value="qa"><MessageSquare className="mr-2 h-4 w-4" /> Campus Q&A</TabsTrigger>
        </TabsList>
        <TabsContent value="presentation" className="flex-1 overflow-hidden mt-0">
          <PresentationGenerator />
        </TabsContent>
        <TabsContent value="qa" className="flex-1 overflow-hidden mt-0">
          <CampusQAChat />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PresentationGenerator() {
    const [topic, setTopic] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [presentation, setPresentation] = useState<Presentation | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() || isLoading) return;

        setIsLoading(true);
        setPresentation(null);
        try {
            const result = await generatePresentation({ topic });
            setPresentation(result);
        } catch (error) {
            console.error("Failed to generate presentation", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1">
                <div className="p-4 md:p-8">
                    {!presentation && !isLoading && (
                        <Card className="max-w-2xl mx-auto border-2 border-dashed shadow-none">
                            <CardHeader className="text-center">
                                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                                    <Wand2 className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="mt-4 font-headline text-2xl">Presentation Generator</CardTitle>
                                <CardDescription>Stuck on a presentation? Enter a topic, and I'll generate a title, slides, and images to get you started.</CardDescription>
                            </CardHeader>
                        </Card>
                    )}
                    
                    {isLoading && <LoadingSkeleton />}
                    
                    {presentation && (
                        <div className="space-y-8 max-w-4xl mx-auto">
                            <h1 className="text-4xl font-bold font-headline text-center">{presentation.title}</h1>
                            {presentation.slides.map((slide, index) => (
                                <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="grid md:grid-cols-2">
                                        <div className="p-6">
                                            <Badge variant="secondary" className="mb-2">Slide {index + 1}</Badge>
                                            <CardTitle className="font-headline text-2xl mb-4">{slide.title}</CardTitle>
                                            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                                                {slide.points.map((point, i) => (
                                                    <li key={i}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="relative min-h-[250px] bg-muted">
                                           {slide.imageUrl && (
                                                <Image 
                                                    src={slide.imageUrl} 
                                                    alt={slide.title} 
                                                    layout="fill"
                                                    objectFit="cover"
                                                    data-ai-hint="presentation slide image"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
             <footer className="p-4 border-t shrink-0 bg-card">
                <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-2xl mx-auto">
                <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic, e.g., 'The Future of Renewable Energy'"
                    disabled={isLoading}
                    className="flex-1 text-base"
                    autoFocus
                />
                <Button type="submit" size="lg" disabled={isLoading || !topic.trim()} className="shrink-0">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    <span className="ml-2">Generate</span>
                </Button>
                </form>
            </footer>
        </div>
    );
}

const LoadingSkeleton = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
                <div className="grid md:grid-cols-2">
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="min-h-[250px]" />
                </div>
            </Card>
        ))}
    </div>
);


interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

function CampusQAChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-ai-message",
      text: "Hello! I'm your CampusAI assistant. Ask me about event schedules, library hours, or directions around campus. You can also use the microphone to ask questions.",
      sender: "ai",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const viewportRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
        viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    
    setInput("");
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: aiMessageId, text: "", sender: "ai" }]);

    try {
      const stream = await getCampusInfoStream({ query: messageText });

      let accumulatedText = "";
      for await (const chunk of stream) {
        accumulatedText += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: accumulatedText } : msg
          )
        );
      }
    } catch (error) {
      console.error("Failed to get response from AI:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "ai",
      };
      setMessages((prev) => 
        prev.map((msg) => msg.id === aiMessageId ? errorMessage : msg)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" viewportRef={viewportRef}>
          <div className="p-4 md:p-8 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex items-end gap-3", message.sender === "user" ? "justify-end" : "justify-start")}>
                {message.sender === 'ai' && (
                  <Avatar className="w-8 h-8 border shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="w-5 h-5" /></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  "max-w-md lg:max-w-2xl p-3 rounded-2xl whitespace-pre-line",
                   message.sender === 'user'
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card text-card-foreground border rounded-bl-none"
                )}>
                  {message.text ? (
                    <p className="text-sm">{message.text}</p>
                  ) : (
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                  )}
                </div>
                 {message.sender === 'user' && (
                  <Avatar className="w-8 h-8 border shrink-0">
                    <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div className="h-4" />
          </div>
        </ScrollArea>
      </div>
      
      <footer className="p-4 border-t shrink-0 bg-card">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about library hours, events, or anything else..."
            disabled={isLoading}
            className="flex-1 text-base"
          />
          <AskWithVoiceDialog onSend={sendMessage} />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="shrink-0">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </footer>
    </div>
  );
}


function AskWithVoiceDialog({ onSend }: { onSend: (text: string) => void }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsTranscribing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            const result = await speechToText({ audioDataUri: base64Audio });
            setTranscribedText(result.transcript);
          } catch (error) {
            console.error("Transcription failed", error);
            toast({ variant: "destructive", title: "Transcription Failed", description: "Could not process your audio. Please try again." });
            setTranscribedText("");
          } finally {
            setIsTranscribing(false);
          }
        };

        // Stop the tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTranscribedText("");
    } catch (err) {
      console.error("Microphone access denied:", err);
      toast({ variant: "destructive", title: "Microphone Access Denied", description: "Please enable microphone permissions in your browser settings." });
      setIsOpen(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if(transcribedText.trim()){
        onSend(transcribedText);
        setIsOpen(false);
        setTranscribedText("");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button type="button" size="icon" variant="outline" onClick={() => setIsOpen(true)}>
          <Mic className="h-4 w-4" />
          <span className="sr-only">Ask with voice</span>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ask with your voice</DialogTitle>
          <DialogDescription>
            {isRecording ? "Recording your question now..." : "Press the button to start recording your question."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Button
              type="button"
              size="icon"
              className={cn("w-20 h-20 rounded-full", isRecording && "bg-destructive hover:bg-destructive/90")}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </Button>
            <p className="text-sm text-muted-foreground">{isRecording ? "Tap to stop" : "Tap to speak"}</p>
        </div>
        
        {(isTranscribing || transcribedText) && (
            <div className="p-4 border rounded-md bg-muted min-h-[80px]">
                {isTranscribing ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin"/>
                        <span>Transcribing...</span>
                    </div>
                ) : (
                    <p>{transcribedText}</p>
                )}
            </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSend} disabled={isTranscribing || !transcribedText.trim()}>
            Send to Assistant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
