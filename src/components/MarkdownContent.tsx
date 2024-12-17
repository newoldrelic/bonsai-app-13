import React from 'react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const formatMarkdown = (text: string) => {
    // Split into lines for block-level formatting
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-semibold mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-semibold mt-4 mb-2">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-bold mt-4 mb-2">
            {line.replace('# ', '')}
          </h1>
        );
      }

      // Lists
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 flex items-center space-x-2 my-1">
            <span className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0" />
            <span>{formatInlineMarkdown(line.replace('- ', ''))}</span>
          </li>
        );
      }
      if (line.match(/^\d+\. /)) {
        return (
          <li key={index} className="ml-4 list-decimal my-1">
            {formatInlineMarkdown(line.replace(/^\d+\. /, ''))}
          </li>
        );
      }

      // Empty lines become breaks
      if (!line.trim()) {
        return <br key={index} />;
      }

      // Regular paragraphs
      return (
        <p key={index} className="my-2">
          {formatInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Helper function to handle inline markdown formatting
  const formatInlineMarkdown = (text: string) => {
    // Process bold text first
    const boldRegex = /\*\*(.+?)\*\*/g;
    const parts = text.split(boldRegex);
    
    return parts.map((part, index) => {
      // Even indices are regular text, odd indices are bold
      if (index % 2 === 0) {
        // Process other inline formatting for regular text
        return part
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/`(.+?)`/g, '<code>$1</code>')
          .split(/(<\/?[^>]+>)/g)
          .map((segment, i) => {
            if (segment.startsWith('<')) return <span key={i} dangerouslySetInnerHTML={{ __html: segment }} />;
            return segment;
          });
      } else {
        // Bold text
        return <strong key={index}>{part}</strong>;
      }
    });
  };

  return (
    <div className={`prose prose-stone dark:prose-invert max-w-none ${className}`}>
      {formatMarkdown(content)}
    </div>
  );
}