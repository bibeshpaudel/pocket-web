import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToolsData } from '../hooks/useToolsData';
import { tools } from '../data/tools';

export default function ToolTracker() {
  const location = useLocation();
  const { addRecent } = useToolsData();

  useEffect(() => {
    const currentPath = location.pathname;
    // Don't track home page
    if (currentPath === '/') return;

    // Find the tool by path
    const activeTool = tools.find(t => t.path === currentPath);
    if (activeTool) {
      addRecent(activeTool.id);
    }
  }, [location, addRecent]);

  return null;
}
