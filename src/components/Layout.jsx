import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CommandPalette from './CommandPalette';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex min-h-screen flex-col md:pl-64 transition-all duration-200 ease-in-out">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          onCommandClick={() => setCommandPaletteOpen(true)}
        />
        
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>

      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={setCommandPaletteOpen} 
      />
    </div>
  );
}
