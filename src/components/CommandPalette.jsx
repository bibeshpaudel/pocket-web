import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { tools } from '../data/tools';
import { cn } from '../lib/utils';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(query.toLowerCase()) ||
    tool.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredTools.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          navigate(filteredTools[selectedIndex].path);
          onClose(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredTools, selectedIndex, navigate]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const element = document.getElementById(`command-item-${selectedIndex}`);
    if (element) {
      element.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="w-full max-w-lg transform rounded-xl bg-popover p-0 shadow-2xl transition-all border border-border animate-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-border px-4" cmdk-input-wrapper="">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={() => onClose(false)} className="ml-2 p-1 hover:bg-accent rounded-md">
            <X className="h-4 w-4 opacity-50" />
          </button>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
          {filteredTools.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No results found.</p>
          ) : (
            <div className="space-y-1">
              {filteredTools.map((tool, index) => (
                <div
                  key={tool.id}
                  id={`command-item-${index}`}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary aria-selected:text-primary-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    index === selectedIndex ? "bg-primary text-primary-foreground" : ""
                  )}
                  onClick={() => {
                    navigate(tool.path);
                    onClose(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <tool.icon className="mr-2 h-4 w-4" />
                  <span>{tool.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-border p-2 text-xs text-muted-foreground flex justify-end px-4 py-2">
          <span className="mr-2">Use arrows to navigate</span>
          <span>Enter to select</span>
        </div>
      </div>
    </div>
  );
}
