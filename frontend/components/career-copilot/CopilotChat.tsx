"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, StopCircle, MessageSquare, Plus, AlertCircle } from 'lucide-react';
import { Button } from "@/components/shared";
import { Input } from "@/components/ui/input";
import type { CareerChat, ChatMessage } from "@/lib/supabase/types";
import { createCareerChat, updateCareerChat } from "@/lib/supabase/career-copilot";

interface CopilotChatProps {
  initialContext: Record<string, unknown>;
  pastChats: CareerChat[];
}

const SUGGESTED_PROMPTS = [
  "Improve Resume",
  "Generate Cover Letter",
  "Prepare for Interview",
  "Career Roadmap",
  "Explain ATS Score",
  "Find Skill Gaps"
];

export function CopilotChat({ initialContext, pastChats: initialChats }: CopilotChatProps) {
  const [chats, setChats] = useState<CareerChat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const selectChat = (id: string | null) => {
    if (isLoading) return;
    setActiveChatId(id);
    if (id) {
      const chat = chats.find(c => c.id === id);
      setMessages(chat ? chat.messages : []);
    } else {
      setMessages([]);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    setError(null);
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };
    
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages,
          context: initialContext
        }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        throw new Error("Failed to get response from AI");
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      let streamText = "";
      const aiMsgId = crypto.randomUUID();
      
      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: 'assistant',
        content: "",
        createdAt: new Date().toISOString()
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        // eslint-disable-next-line react-hooks/immutability
        streamText = streamText + chunk;
        
        setMessages(prev => prev.map(m => 
          m.id === aiMsgId ? { ...m, content: streamText } : m
        ));
      }

      // Save to database
      const finalMessages = [...newMessages, {
        id: aiMsgId,
        role: 'assistant',
        content: streamText,
        createdAt: new Date().toISOString()
      } as ChatMessage];

      if (activeChatId) {
        await updateCareerChat(activeChatId, finalMessages);
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: finalMessages, updated_at: new Date().toISOString() } : c));
      } else {
        // Create new chat
        const title = text.slice(0, 30) + (text.length > 30 ? '...' : '');
        const newChat = await createCareerChat(title, finalMessages);
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Handle cancel
        // Stream cancelled
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] w-full max-w-7xl mx-auto rounded-xl border border-border overflow-hidden bg-card shadow-sm">
      
      {/* Left Sidebar: History */}
      <div className="w-64 border-r border-border bg-secondary/10 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-border">
          <Button fullWidth onClick={() => selectChat(null)} variant={!activeChatId ? "primary" : "outline"}>
            <Plus className="w-4 h-4 mr-2" /> New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => selectChat(chat.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${
                activeChatId === chat.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary/50 text-muted-foreground'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
          {chats.length === 0 && (
            <p className="text-xs text-muted-foreground text-center p-4">No past conversations.</p>
          )}
        </div>
      </div>

      {/* Right Area: Chat Window */}
      <div className="flex-1 flex flex-col bg-background/50 relative">
        
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">AI Career Copilot</h2>
                <p className="text-muted-foreground">
                  I have access to your resume, saved jobs, and applications. How can I help you level up your career today?
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {SUGGESTED_PROMPTS.map(p => (
                  <button 
                    key={p}
                    onClick={() => handleSend(p)}
                    className="px-3 py-1.5 rounded-full border border-border bg-card text-sm hover:bg-primary/5 hover:border-primary/30 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg.id || idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-secondary/30 border border-border rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {error && (
            <div className="mx-auto max-w-lg p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">Error</p>
                <p className="opacity-90">{error}</p>
                <button onClick={() => setError(null)} className="text-xs underline mt-1 opacity-75 hover:opacity-100">Dismiss</button>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <form 
            onSubmit={e => { e.preventDefault(); handleSend(input); }} 
            className="relative flex items-center max-w-4xl mx-auto"
          >
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything about your career..."
              className="pr-24 py-6 rounded-full bg-background border-border shadow-sm focus-visible:ring-1"
              disabled={isLoading}
            />
            <div className="absolute right-2 flex items-center">
              {isLoading ? (
                <Button type="button" variant="ghost" size="sm" onClick={handleCancel} className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full w-10 h-10 p-0">
                  <StopCircle className="w-5 h-5" />
                </Button>
              ) : (
                <Button type="submit" disabled={!input.trim()} className="rounded-full w-10 h-10 p-0">
                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              )}
            </div>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-muted-foreground opacity-70">
              AI Copilot can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
