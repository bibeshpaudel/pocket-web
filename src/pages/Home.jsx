import { Link } from 'react-router-dom';
import { tools } from '../data/tools';
import { usePinnedTools } from '../contexts/PinnedToolsContext';
import { Pin } from 'lucide-react';

export default function Home({ searchTerm }) {
  const { pinnedTools } = usePinnedTools();

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedToolObjects = tools.filter(tool => pinnedTools.includes(tool.id));
  
  const categories = [...new Set(filteredTools.map(tool => tool.category))];

  return (
    <div className="space-y-12">
      {/* Pinned Section */}
      {pinnedToolObjects.length > 0 && !searchTerm && (
        <section>
          <h2 className="text-sm font-bold text-textSecondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <Pin className="w-4 h-4" /> Pinned Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedToolObjects.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Main Grid */}
      {searchTerm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        categories.map(category => (
          <section key={category}>
            <h2 className="text-sm font-bold text-textSecondary uppercase tracking-wider mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.filter(t => t.category === category).map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        ))
      )}

      {filteredTools.length === 0 && (
        <div className="text-center py-20">
          <p className="text-textSecondary text-lg">No tools found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}

function ToolCard({ tool }) {
  return (
    <Link 
      to={tool.path}
      className="group block p-6 bg-surface backdrop-blur-md border border-border rounded-base hover:border-accent/50 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-base bg-slate-900/50 border border-border group-hover:border-accent/50 group-hover:text-accent transition-colors">
          <tool.icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1 text-text group-hover:text-accent transition-colors">{tool.name}</h3>
          <p className="text-textSecondary text-sm leading-relaxed">{tool.description}</p>
        </div>
      </div>
    </Link>
  );
}
