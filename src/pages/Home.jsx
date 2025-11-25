import { useNavigate } from 'react-router-dom';
import { tools } from '../data/tools';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Pocket. Select a tool to get started.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.filter(t => t.id !== 'json-to-model').map((tool) => (
          <Card 
            key={tool.id} 
            className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm"
            onClick={() => navigate(tool.path)}
          >
            <CardHeader className="pb-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <tool.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs font-normal">
                  {tool.category}
                </Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
