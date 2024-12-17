import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Info } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { auth } from '../config/firebase';

interface Message {
  content: string;
  isUser: boolean;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<string>;
}

function getFirstName(user: any): string {
  if (user?.displayName) {
    return user.displayName.split(' ')[0];
  }
  const email = user?.email || '';
  const namePart = email.split('@')[0];
  return namePart.split(/[._]/)[0].charAt(0).toUpperCase() + namePart.split(/[._]/)[0].slice(1);
}

export function ChatInterface({ onSendMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([{
    content: `Hello ${getFirstName(auth.currentUser)}! I'm Ken Nakamura, your bonsai expert. How can I help you today?`,
    isUser: false
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ 
        behavior: 'auto',
        block: 'start'
      });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await onSendMessage(userMessage);
      setMessages(prev => [...prev, { content: response, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={chatContainerRef}
      className="flex flex-col h-[600px] md:h-[500px] bg-white dark:bg-stone-800 rounded-lg shadow-lg"
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index}
            message={message.content}
            isUser={message.isUser}
          />
        ))}
        {messages.length === 1 && (
          <p className="text-xs text-stone-500 dark:text-stone-400 text-center flex items-center justify-center gap-1">
            <Info className="w-3 h-3" />
            <span>Expert responses can be downloaded for your reference</span>
          </p>
        )}
        {isLoading && (
          <div className="flex items-center space-x-2 text-bonsai-green">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Ken is typing...</span>
          </div>
        )}
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="flex-shrink-0 p-4 border-t dark:border-stone-700 bg-white dark:bg-stone-800"
      >
        <div className="relative flex w-full">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about bonsai care..."
            className="w-full pr-12 pl-4 py-2 bg-stone-100 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-8 flex items-center justify-center bg-bonsai-green text-white rounded-lg hover:bg-bonsai-moss transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}