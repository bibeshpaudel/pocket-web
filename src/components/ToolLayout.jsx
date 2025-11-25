import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import SEO from './SEO';

export default function ToolLayout({ title, description, children }) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" /> Home
        </Link>
        <ChevronRight className="w-4 h-4 opacity-50" />
        <span className="text-foreground font-medium">{title}</span>
      </nav>

      <SEO title={title} description={description} />

      <div className="flex items-start justify-between border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
      </div>

      <div className="min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
