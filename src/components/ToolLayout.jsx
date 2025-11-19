import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, Pin } from 'lucide-react';
import { tools } from '../data/tools';
import { usePinnedTools } from '../contexts/PinnedToolsContext';

export default function ToolLayout({ title, description, children }) {
  const location = useLocation();
  const { togglePin, isPinned } = usePinnedTools();
  
  const currentTool = tools.find(t => t.path === location.pathname);
  const isCurrentPinned = currentTool ? isPinned(currentTool.id) : false;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-textSecondary mb-8">
        <Link to="/" className="hover:text-text transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" /> Home
        </Link>
        <ChevronRight className="w-4 h-4 opacity-50" />
        <span className="text-text font-medium">{title}</span>
      </nav>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">{title}</h1>
          <p className="text-textSecondary text-lg">{description}</p>
        </div>
        {currentTool && (
          <button
            onClick={() => togglePin(currentTool.id)}
            className={`p-2 rounded-base border transition-all ${
              isCurrentPinned
                ? 'bg-accent/10 text-accent border-accent/50'
                : 'bg-surface border-border text-textSecondary hover:text-text hover:border-textSecondary'
            }`}
            title={isCurrentPinned ? "Unpin Tool" : "Pin Tool"}
          >
            <Pin className={`w-5 h-5 ${isCurrentPinned ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="bg-surface backdrop-blur-md border border-border rounded-base shadow-lg p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
