import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CommandPalette from './CommandPalette';
import Footer from './Footer';

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
        
        <main className="flex-1 p-6 overflow-x-hidden flex flex-col">
          <div className="mx-auto max-w-6xl flex-1 w-full">
            {children}
          </div>
        </main>
        <Footer />
      </div>

      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={setCommandPaletteOpen} 
      />
    </div>
  );
}
