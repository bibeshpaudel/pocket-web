import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-6 text-center text-sm text-muted-foreground mt-auto">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex flex-col md:text-left">
            <p>&copy; {new Date().getFullYear()} Pocket. All rights reserved.</p>
            <p className="text-xs opacity-70 mt-1">All processing happens in your browser.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/bibeshpaudel/pocket-web"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
