import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { tools } from '../data/tools';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ArrowRight, Star, Settings, LayoutDashboard, History } from 'lucide-react';
import SEO from '../components/SEO';
import { useToolsData } from '../hooks/useToolsData';

const ToolCard = ({ tool, isFavorite, onToggleFavorite, onClick, className = '' }) => {
  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 cursor-pointer border border-border/50 bg-card/50 backdrop-blur-sm flex flex-col h-full ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <tool.icon className="h-5 w-5" />
          </div>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onToggleFavorite(tool.id); 
            }}
            className={`p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        <CardTitle className="text-lg">{tool.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs font-normal">
            {tool.category}
          </Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
        </div>
      </CardContent>
    </Card>
  );
};

const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
      ${active 
        ? 'bg-primary text-primary-foreground shadow-md' 
        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
      }`}
  >
    {label}
  </button>
);

const SectionHeader = ({ title, actionLabel, onAction }) => (
  <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    {actionLabel && (
      <button onClick={onAction} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        {actionLabel}
      </button>
    )}
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  const { favorites, recent, settings, toggleFavorite, clearFavorites, updateSetting } = useToolsData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const favoriteTools = tools.filter(t => favorites.includes(t.id) && t.id !== 'json-to-model');
  const recentTools = recent.map(id => tools.find(t => t.id === id)).filter(t => t !== undefined && t.id !== 'json-to-model');
  
  // Extract unique categories dynamically based on available tools
  const categories = ['All', ...new Set(tools.filter(t => t.id !== 'json-to-model').map(t => t.category).filter(Boolean))].sort();

  // Filter tools by active category
  const visibleMainTools = tools.filter(t => {
    if (t.id === 'json-to-model') return false;
    if (activeCategory === 'All') return true;
    return t.category === activeCategory;
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 relative">
      <SEO 
        title="Dashboard" 
        description="Pocket - A collection of essential developer tools including JSON Formatter, Image Compressor, and more." 
      />
      
      {/* Header and Settings Panel */}
      <div className="flex items-start justify-between relative">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Pocket. Select a tool to get started.
          </p>
        </div>

        <div className="relative" ref={settingsRef}>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-all duration-300 ${showSettings ? 'bg-primary text-primary-foreground shadow-md rotate-90' : 'hover:bg-muted text-muted-foreground hover:text-foreground hover:rotate-45'}`}
            title="Dashboard Settings"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Dashboard Settings Dropdown */}
          <div 
            className={`absolute top-12 right-0 w-72 p-1 bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl z-50 origin-top-right transition-all duration-200 ease-out ${
              showSettings 
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="px-3 py-3 border-b border-border/50 mb-1">
              <h3 className="font-semibold text-sm flex items-center">
                <LayoutDashboard className="w-4 h-4 mr-2 text-primary" />
                Customize View
              </h3>
            </div>
            <div className="space-y-1 p-2">
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-muted/50 rounded-lg transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${settings.showFavorites ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : 'bg-muted text-muted-foreground'}`}>
                    <Star className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Favorites Section</span>
                </div>
                {/* Custom Toggle Switch */}
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={settings.showFavorites} onChange={(e) => updateSetting('showFavorites', e.target.checked)} />
                  <div className="w-9 h-5 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>
              
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-muted/50 rounded-lg transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${settings.showRecent ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                    <History className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Recently Used</span>
                </div>
                {/* Custom Toggle Switch */}
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={settings.showRecent} onChange={(e) => updateSetting('showRecent', e.target.checked)} />
                  <div className="w-9 h-5 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {settings.showFavorites && favoriteTools.length > 0 && (
        <section>
          <SectionHeader title="Favorites" actionLabel="Clear" onAction={clearFavorites} />
          <div 
            className="grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
          >
            {favoriteTools.map(tool => (
              <ToolCard 
                key={`fav-${tool.id}`} 
                tool={tool} 
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
                onClick={() => navigate(tool.path)}
              />
            ))}
          </div>
        </section>
      )}

      {settings.showRecent && recentTools.length > 0 && (
        <section>
          <SectionHeader title="Recently Used" />
          <div className="relative">
            {/* Horizontal Scroll Container */}
            <div className="flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {recentTools.map(tool => (
                <div key={`recent-${tool.id}`} className="flex-none w-[280px] snap-start h-full">
                  <ToolCard 
                    tool={tool} 
                    isFavorite={favorites.includes(tool.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={() => navigate(tool.path)}
                  />
                </div>
              ))}
            </div>
            {/* Right Gradient Fade */}
            <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 opacity-100"></div>
          </div>
        </section>
      )}

      <section>
        <SectionHeader title="All Tools" />
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <FilterChip 
              key={cat} 
              label={cat} 
              active={activeCategory === cat} 
              onClick={() => setActiveCategory(cat)} 
            />
          ))}
        </div>

        <div 
          className="grid gap-6 transition-all duration-300"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
        >
          {visibleMainTools.length > 0 ? (
            visibleMainTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={toggleFavorite}
                onClick={() => navigate(tool.path)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
              No tools found in this category.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
