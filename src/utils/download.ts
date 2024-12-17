export function downloadText(content: string, filename: string) {
    // Create blob with UTF-8 encoding
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    
    // Create temporary link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    
    // Append to document, click, and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
  
  export function formatAnalysisForDownload(content: string, type: 'chat' | 'health') {
    const date = new Date().toLocaleString();
    const header = type === 'chat' 
      ? 'Bonsai Expert Chat Session\n' 
      : 'Bonsai Health Analysis\n';
    
    return `${header}Date: ${date}\n\n${content}\n\nProvided by Bonsai for Beginners`;
  }