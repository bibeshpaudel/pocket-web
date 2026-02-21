import React, { useState } from 'react';
import { Maximize2, X, Copy, Check } from 'lucide-react';

export default function ExpandableOutput({ children, value, title = "Preview" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative w-full h-full group">
      {children}
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground rounded border border-border/50 shadow-sm z-10"
        title="Expand View"
      >
        <Maximize2 size={14} />
      </button>

      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
          <div className="bg-card w-full h-full sm:max-w-5xl sm:max-h-[85vh] rounded-lg border border-border flex flex-col shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30">
              <h3 className="font-medium text-sm text-foreground">{title}</h3>
              <div className="flex items-center gap-2">
                {value !== undefined && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-background text-foreground hover:bg-muted rounded border border-border transition-colors"
                  >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-md transition-colors ml-2"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-grow w-full overflow-hidden bg-transparent relative h-full">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
