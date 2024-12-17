import React from 'react';
import { Bot, User, Download } from 'lucide-react';
import { MarkdownContent } from './MarkdownContent';
import { downloadText, formatAnalysisForDownload } from '../utils/download';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export function ChatMessage({ message, isUser }: ChatMessageProps) {
  const handleDownload = () => {
    if (!isUser) {
      const formattedContent = formatAnalysisForDownload(message, 'chat');
      downloadText(formattedContent, `bonsai-chat-${Date.now()}.txt`);
    }
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-bonsai-green' : 'bg-stone-200 dark:bg-stone-700'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-bonsai-green dark:text-white" />
        )}
      </div>
      <div className="flex-1">
        <div className={`px-4 py-2 rounded-lg ${
          isUser 
            ? 'bg-bonsai-green text-white' 
            : 'bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
        }`}>
          <MarkdownContent content={message} />
        </div>
        {!isUser && (
          <button
            onClick={handleDownload}
            className="mt-1 text-xs text-stone-500 dark:text-stone-400 hover:text-bonsai-green dark:hover:text-bonsai-green flex items-center gap-1 transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Download response</span>
          </button>
        )}
      </div>
    </div>
  );
}