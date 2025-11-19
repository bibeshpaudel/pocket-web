import { createContext, useState, useEffect, useContext } from 'react';

const PinnedToolsContext = createContext();

export function PinnedToolsProvider({ children }) {
  const [pinnedTools, setPinnedTools] = useState(() => {
    const saved = localStorage.getItem('pinnedTools');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pinnedTools', JSON.stringify(pinnedTools));
  }, [pinnedTools]);

  const togglePin = (toolId) => {
    setPinnedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId) 
        : [...prev, toolId]
    );
  };

  const isPinned = (toolId) => pinnedTools.includes(toolId);

  return (
    <PinnedToolsContext.Provider value={{ pinnedTools, togglePin, isPinned }}>
      {children}
    </PinnedToolsContext.Provider>
  );
}

export function usePinnedTools() {
  return useContext(PinnedToolsContext);
}
