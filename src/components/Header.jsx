import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import logo from '../assets/logo.svg';

export default function Header({ searchTerm, onSearchChange }) {
  return (
    <header className="border-b border-border bg-surface backdrop-blur-md sticky top-0 z-30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-text hover:text-accent transition-colors flex items-center gap-2">
          <img src={logo} alt="Pocket Logo" className="h-8 w-8" />
          Pocket
        </Link>
        
        <div className="flex-1 max-w-md relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-textSecondary group-focus-within:text-accent transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-base leading-5 bg-slate-900/50 text-text placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm transition-all"
          />
        </div>

        <div className="w-20"></div> {/* Spacer for balance */}
      </div>
    </header>
  );
}
