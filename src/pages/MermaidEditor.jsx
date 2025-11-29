import { useState, useEffect, useRef, useCallback } from 'react';
import ToolLayout from '../components/ToolLayout';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Download, ZoomIn, ZoomOut, RotateCcw, Image, FileText, LayoutTemplate, Palette } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

const TEMPLATES = {
  'Flowchart': `graph TD
  A[Start] --> B{Is it working?}
  B -- Yes --> C[Great!]
  B -- No --> D[Debug]
  D --> B`,
  'Sequence': `sequenceDiagram
  participant Alice
  participant Bob
  Alice->>John: Hello John, how are you?
  loop Healthcheck
      John->>John: Fight against hypochondria
  end
  Note right of John: Rational thoughts <br/>prevail!
  John-->>Alice: Great!
  John->>Bob: How about you?
  Bob-->>John: Jolly good!`,
  'Class': `classDiagram
  Animal <|-- Duck
  Animal <|-- Fish
  Animal <|-- Zebra
  Animal : +int age
  Animal : +String gender
  Animal: +isMammal()
  Animal: +mate()
  class Duck{
      +String beakColor
      +swim()
      +quack()
  }
  class Fish{
      -int sizeInFeet
      -canEat()
  }
  class Zebra{
      +bool is_wild
      +run()
  }`,
  'State': `stateDiagram-v2
  [*] --> Still
  Still --> [*]
  Still --> Moving
  Moving --> Still
  Moving --> Crash
  Crash --> [*]`,
  'Gantt': `gantt
  title A Gantt Diagram
  dateFormat  YYYY-MM-DD
  section Section
  A task           :a1, 2014-01-01, 30d
  Another task     :after a1  , 20d
  section Another
  Task in sec      :2014-01-12  , 12d
  another task      : 24d`,
  'Pie': `pie title Pets adopted by volunteers
  "Dogs" : 386
  "Cats" : 85
  "Rats" : 15`,
  'Mindmap': `mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping`,
  'ER Diagram': `erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE-ITEM : contains
  CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`
};

const THEMES = [
  { id: 'dark', name: 'Dark' },
  { id: 'default', name: 'Light' },
  { id: 'neutral', name: 'Neutral' },
  { id: 'forest', name: 'Forest' },
  { id: 'base', name: 'Base' },
];

export default function MermaidEditor() {
  const [code, setCode] = useState(TEMPLATES['Flowchart']);
  const [error, setError] = useState('');
  const [svg, setSvg] = useState('');
  const [theme, setTheme] = useState('dark');
  const previewRef = useRef(null);
  const transformComponentRef = useRef(null);

  const renderChart = useCallback(async () => {
    try {
      mermaid.initialize({
        startOnLoad: true,
        theme: theme,
        securityLevel: 'loose',
        fontFamily: 'Inter',
        darkMode: theme === 'dark',
      });

      const { svg } = await mermaid.render('mermaid-chart', code);
      setSvg(svg);
      setError('');
    } catch (err) {
      setError('Syntax Error: ' + err.message);
    }
  }, [code, theme]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      renderChart();
    }, 500);
    return () => clearTimeout(timeout);
  }, [renderChart]);

  // Auto-center when SVG changes
  useEffect(() => {
    if (svg && transformComponentRef.current) {
        // Small timeout to allow DOM to update with new SVG size
        setTimeout(() => {
            transformComponentRef.current.centerView();
        }, 100);
    }
  }, [svg]);

  const handleExport = async (format) => {
    const element = document.getElementById('mermaid-export-view');
    if (!element) return;

    try {
      const bgColor = theme === 'dark' ? '#020617' : '#ffffff';
      
      if (format === 'png') {
        const dataUrl = await toPng(element, { backgroundColor: bgColor });
        const link = document.createElement('a');
        link.download = 'diagram.png';
        link.href = dataUrl;
        link.click();
      } else if (format === 'svg') {
        const dataUrl = await toSvg(element, { backgroundColor: bgColor });
        const link = document.createElement('a');
        link.download = 'diagram.svg';
        link.href = dataUrl;
        link.click();
      } else if (format === 'pdf') {
        const dataUrl = await toPng(element, { backgroundColor: bgColor });
        const img = new window.Image();
        img.src = dataUrl;
        await new Promise((resolve) => { img.onload = resolve; });
        
        const pdf = new jsPDF({
            orientation: img.width > img.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [img.width, img.height]
        });
        
        pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
        pdf.save('diagram.pdf');
      }
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  return (
    <ToolLayout
      title="Mermaid Diagram Editor"
      description="Create diagrams using code with real-time preview."
    >
      <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
        {/* Editor */}
        <div className="flex flex-col gap-2 h-full">
          <div className="flex justify-between items-center bg-card p-2 rounded-t-base border-x border-t border-border">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <LayoutTemplate size={16} className="text-muted-foreground" />
                    <select 
                        className="bg-transparent text-sm text-foreground focus:outline-none cursor-pointer"
                        onChange={(e) => setCode(TEMPLATES[e.target.value])}
                        defaultValue="Flowchart"
                    >
                        {Object.keys(TEMPLATES).map(t => (
                            <option key={t} value={t} className="bg-card text-foreground">{t}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <Palette size={16} className="text-muted-foreground" />
                    <select 
                        className="bg-transparent text-sm text-foreground focus:outline-none cursor-pointer"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        {THEMES.map(t => (
                            <option key={t.id} value={t.id} className="bg-card text-foreground">{t.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <a 
              href="https://mermaid.js.org/intro/" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              Syntax Guide
            </a>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-grow p-4 bg-card border border-border rounded-b-base font-mono text-sm focus:outline-none focus:border-primary transition-colors resize-none text-foreground"
            spellCheck="false"
            placeholder="Enter Mermaid code here..."
          />
          {error && (
            <div className="p-3 bg-red-500/20 text-red-200 border border-red-500/50 rounded-base text-sm font-bold">
              {error}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-2 h-full">
            <TransformWrapper
              ref={transformComponentRef}
              initialScale={1}
              minScale={0.5}
              maxScale={4}
              centerOnInit
              limitToBounds={false}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="flex justify-between items-center bg-card p-2 rounded-t-base border-x border-t border-border">
                    <label className="font-bold text-textSecondary text-sm">Preview</label>
                    <div className="flex items-center gap-4">
                        {/* Zoom Controls */}
                        <div className="flex gap-1 border-r border-border pr-4">
                            <button onClick={() => zoomIn()} className="p-1.5 hover:bg-primary/10 rounded text-muted-foreground hover:text-foreground transition-colors" title="Zoom In">
                                <ZoomIn className="w-4 h-4" />
                            </button>
                            <button onClick={() => zoomOut()} className="p-1.5 hover:bg-primary/10 rounded text-muted-foreground hover:text-foreground transition-colors" title="Zoom Out">
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <button onClick={() => resetTransform()} className="p-1.5 hover:bg-primary/10 rounded text-muted-foreground hover:text-foreground transition-colors" title="Reset Zoom">
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Export Controls */}
                        <div className="flex gap-2">
                            <button onClick={() => handleExport('png')} className="p-1.5 hover:bg-primary/10 rounded text-muted-foreground hover:text-foreground transition-colors" title="Export PNG">
                                <Image className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleExport('svg')} className="p-1.5 hover:bg-primary/10 rounded text-muted-foreground hover:text-foreground transition-colors" title="Export SVG">
                                <Download className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleExport('pdf')} className="p-1.5 hover:bg-primary/10 rounded text-muted-foreground hover:text-foreground transition-colors" title="Export PDF">
                                <FileText className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                  </div>
                  
                  <div className={`flex-grow border border-border rounded-b-base overflow-hidden relative ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`} ref={previewRef}>
                      <TransformComponent 
                        wrapperClass="w-full h-full" 
                        contentClass="w-full h-full flex items-center justify-center"
                        wrapperStyle={{ width: "100%", height: "100%" }}
                      >
                        <div 
                          id="mermaid-export-view"
                          className="p-8"
                          style={{
                              backgroundColor: theme === 'dark' ? '#020617' : '#ffffff',
                              color: theme === 'dark' ? '#f8fafc' : '#000000',
                          }}
                          dangerouslySetInnerHTML={{ __html: svg }}
                        />
                      </TransformComponent>
                  </div>
                </>
              )}
            </TransformWrapper>
        </div>
      </div>
    </ToolLayout>
  );
}
