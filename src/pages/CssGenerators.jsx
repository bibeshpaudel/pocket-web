import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Copy, CheckCircle2, Plus, Minus, Trash2, Image as ImageIcon, PaintBucket } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';

export default function CssGenerators() {
  const [activeTab, setActiveTab] = useState('box-shadow');
  const [isTailwind, setIsTailwind] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- Box Shadow State ---
  const [hOffset, setHOffset] = useState(10);
  const [vOffset, setVOffset] = useState(10);
  const [blur, setBlur] = useState(15);
  const [spread, setSpread] = useState(-3);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState(0.5);
  const [inset, setInset] = useState(false);
  
  // Preview Colors (Box Shadow)
  const [boxColor, setBoxColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#e5e7eb');

  // --- Gradient State ---
  const [gradType, setGradType] = useState('linear');
  const [gradAngle, setGradAngle] = useState(90);
  const [gradStops, setGradStops] = useState([
    { id: 1, color: '#4f46e5', stop: 0 },
    { id: 2, color: '#ec4899', stop: 50 },
    { id: 3, color: '#4f46e5', stop: 100 }
  ]);

  // --- Glassmorphism State ---
  const [glassColor, setGlassColor] = useState('#ffffff');
  const [glassOpacity, setGlassOpacity] = useState(0.1);
  const [glassBlur, setGlassBlur] = useState(16);
  const [glassBorderOpacity, setGlassBorderOpacity] = useState(0.2);
  const [glassSaturate, setGlassSaturate] = useState(180);
  const [glassBgType, setGlassBgType] = useState('image'); // 'image' or 'color'
  const [glassBgImage, setGlassBgImage] = useState('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1124&q=100');
  const [glassBaseColor, setGlassBaseColor] = useState('#1e293b'); // Dark BG color

  // Helpers
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getGradientString = () => {
    // Sort stops to ensure correct CSS rendering order
    const sortedStops = [...gradStops].sort((a, b) => a.stop - b.stop);
    const stopString = sortedStops.map(s => `${s.color} ${s.stop}%`).join(', ');

    if (gradType === 'linear') {
      return `linear-gradient(${gradAngle}deg, ${stopString})`;
    } else if (gradType === 'radial') {
      return `radial-gradient(circle, ${stopString})`;
    } else if (gradType === 'conic') {
      return `conic-gradient(from ${gradAngle}deg at 50% 50%, ${stopString})`;
    }
  };

  const generateBoxShadowCode = () => {
    const rgba = hexToRgba(shadowColor, shadowOpacity);
    const insetText = inset ? 'inset ' : '';
    const cssValue = `${insetText}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${rgba}`;
    
    if (isTailwind) {
      return `shadow-[${cssValue.replace(/ /g, '_')}]`;
    }
    return `box-shadow: ${cssValue};\n-webkit-box-shadow: ${cssValue};\n-moz-box-shadow: ${cssValue};`;
  };

  const generateGradientCode = () => {
    const cssValue = getGradientString();
    if (isTailwind) {
      return `bg-[${cssValue.replace(/ /g, '_')}]`;
    }
    return `background: ${cssValue};`;
  };

  const generateGlassCode = () => {
    const bgColor = hexToRgba(glassColor, glassOpacity);
    const borderColor = hexToRgba('#ffffff', glassBorderOpacity);
    const filterProp = `blur(${glassBlur}px) saturate(${glassSaturate}%)`;

    if (isTailwind) {
      // Tailwind arbitrary values string
      return `bg-[${bgColor.replace(/ /g, '')}] backdrop-blur-[${glassBlur}px] backdrop-saturate-[${glassSaturate}%] border border-[${borderColor.replace(/ /g, '')}]`;
    }
    
    return `background: ${bgColor};\nbackdrop-filter: ${filterProp};\n-webkit-backdrop-filter: ${filterProp};\nborder: 1px solid ${borderColor};`;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic code output block
  let currentCode = '';
  if (activeTab === 'box-shadow') currentCode = generateBoxShadowCode();
  if (activeTab === 'gradient') currentCode = generateGradientCode();
  if (activeTab === 'glass') currentCode = generateGlassCode();

  // Dynamic preview styles
  let previewStyle = {};
  if (activeTab === 'box-shadow') {
    previewStyle = { 
      boxShadow: `${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${hexToRgba(shadowColor, shadowOpacity)}`,
      backgroundColor: boxColor 
    };
  } else if (activeTab === 'gradient') {
    previewStyle = { backgroundImage: getGradientString() };
  } else if (activeTab === 'glass') {
    previewStyle = {
      background: hexToRgba(glassColor, glassOpacity),
      backdropFilter: `blur(${glassBlur}px) saturate(${glassSaturate}%)`,
      WebkitBackdropFilter: `blur(${glassBlur}px) saturate(${glassSaturate}%)`,
      border: `1px solid ${hexToRgba('#ffffff', glassBorderOpacity)}`
    };
  }

  // Gradient Handlers
  const addStop = () => {
    if (gradStops.length >= 8) return; // Prevent too many stops
    const newId = Math.max(0, ...gradStops.map(s => s.id)) + 1;
    // Guess a sensible default stop value (middle of last two)
    const newStop = gradStops.length > 0 ? Math.min(100, gradStops[gradStops.length-1].stop + 10) : 50;
    setGradStops([...gradStops, { id: newId, color: '#00ccff', stop: newStop }]);
  };

  const removeStop = (id) => {
    if (gradStops.length <= 2) return; // Require at least 2 stops
    setGradStops(gradStops.filter(s => s.id !== id));
  };

  const updateStop = (id, field, value) => {
    setGradStops(gradStops.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <ToolLayout
      title="CSS Generators"
      description="Create complex CSS properties visually for UI effects."
    >
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-2">
        <Button 
          variant={activeTab === 'box-shadow' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('box-shadow')}
        >
          Box Shadow
        </Button>
        <Button 
          variant={activeTab === 'gradient' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('gradient')}
        >
          Gradient
        </Button>
        <Button 
          variant={activeTab === 'glass' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('glass')}
        >
          Glassmorphism
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Controls Column */}
        <Card className="p-6 space-y-6 border border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Controls</h2>
            <div className="flex items-center space-x-2 bg-secondary rounded-lg p-1">
              <button 
                className={`px-3 py-1 rounded text-sm transition-colors ${!isTailwind ? 'bg-background shadow font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setIsTailwind(false)}
              >
                CSS
              </button>
              <button 
                className={`px-3 py-1 rounded text-sm transition-colors ${isTailwind ? 'bg-background shadow font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setIsTailwind(true)}
              >
                Tailwind
              </button>
            </div>
          </div>

          {activeTab === 'box-shadow' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-medium">Horizontal Offset</label><span className="text-sm text-muted-foreground">{hOffset}px</span></div>
                <input type="range" min="-100" max="100" value={hOffset} onChange={(e) => setHOffset(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-medium">Vertical Offset</label><span className="text-sm text-muted-foreground">{vOffset}px</span></div>
                <input type="range" min="-100" max="100" value={vOffset} onChange={(e) => setVOffset(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-medium">Blur Radius</label><span className="text-sm text-muted-foreground">{blur}px</span></div>
                <input type="range" min="0" max="150" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-medium">Spread Radius</label><span className="text-sm text-muted-foreground">{spread}px</span></div>
                <input type="range" min="-100" max="100" value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shadow Color</label>
                  <div className="flex items-center space-x-2">
                    <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    <span className="text-sm border p-1 rounded font-mono uppercase bg-muted/50">{shadowColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><label className="text-sm font-medium">Opacity</label><span className="text-sm text-muted-foreground">{shadowOpacity}</span></div>
                  <input type="range" min="0" max="1" step="0.01" value={shadowOpacity} onChange={(e) => setShadowOpacity(Number(e.target.value))} className="w-full accent-primary" />
                </div>
              </div>
              <div className="pt-2 flex items-center space-x-2">
                <input type="checkbox" id="inset-check" checked={inset} onChange={(e) => setInset(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary accent-primary" />
                <label htmlFor="inset-check" className="text-sm font-medium cursor-pointer">Inset Shadow</label>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 mt-2 border-t border-border">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview Box Color</label>
                  <div className="flex items-center space-x-2">
                    <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    <span className="text-xs font-mono">{boxColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview Background</label>
                  <div className="flex items-center space-x-2">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    <span className="text-xs font-mono">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gradient' && (
            <div className="space-y-4">
              <div className="space-y-2 bg-muted/30 p-3 rounded-lg border border-border">
                <label className="text-sm font-medium">Type</label>
                <div className="flex space-x-2">
                  <Button size="sm" variant={gradType === 'linear' ? 'default' : 'outline'} onClick={() => setGradType('linear')} className="w-full">Linear</Button>
                  <Button size="sm" variant={gradType === 'radial' ? 'default' : 'outline'} onClick={() => setGradType('radial')} className="w-full">Radial</Button>
                  <Button size="sm" variant={gradType === 'conic' ? 'default' : 'outline'} onClick={() => setGradType('conic')} className="w-full">Conic</Button>
                </div>
              </div>
              
              {(gradType === 'linear' || gradType === 'conic') && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between"><label className="text-sm font-medium">Angle</label><span className="text-sm text-muted-foreground">{gradAngle}°</span></div>
                  <input type="range" min="0" max="360" value={gradAngle} onChange={(e) => setGradAngle(Number(e.target.value))} className="w-full accent-primary" />
                </div>
              )}

              <div className="pt-4 mt-4 border-t border-border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold">Color Stops</h3>
                  <Button size="sm" variant="outline" onClick={addStop} disabled={gradStops.length >= 8} className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> Add Stop
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {gradStops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center gap-4 bg-muted/40 p-2 rounded-lg border border-border/50">
                      <div className="flex flex-col space-y-1 w-1/3">
                        <div className="flex items-center space-x-2">
                          <input type="color" value={stop.color} onChange={(e) => updateStop(stop.id, 'color', e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                          <span className="text-xs font-mono uppercase truncate">{stop.color}</span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col space-y-1">
                        <div className="flex justify-between"><span className="text-xs text-muted-foreground">Position</span><span className="text-xs">{stop.stop}%</span></div>
                        <input type="range" min="0" max="100" value={stop.stop} onChange={(e) => updateStop(stop.id, 'stop', Number(e.target.value))} className="w-full accent-primary" />
                      </div>
                      <div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeStop(stop.id)}
                          disabled={gradStops.length <= 2}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'glass' && (
            <div className="space-y-4">
              <div className="space-y-2 bg-muted/30 p-3 rounded-lg border border-border mb-4">
                <label className="text-sm font-medium mb-1 block">Preview Background Setting</label>
                <div className="flex space-x-2 mb-3">
                  <Button size="sm" variant={glassBgType === 'image' ? 'default' : 'outline'} onClick={() => setGlassBgType('image')} className="w-full">
                    <ImageIcon className="w-4 h-4 mr-2" /> Image
                  </Button>
                  <Button size="sm" variant={glassBgType === 'color' ? 'default' : 'outline'} onClick={() => setGlassBgType('color')} className="w-full">
                    <PaintBucket className="w-4 h-4 mr-2" /> Color
                  </Button>
                </div>
                {glassBgType === 'image' && (
                  <input 
                    type="text" 
                    value={glassBgImage} 
                    onChange={(e) => setGlassBgImage(e.target.value)} 
                    placeholder="https://..."
                    className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                  />
                )}
                {glassBgType === 'color' && (
                  <div className="flex items-center space-x-2">
                    <input type="color" value={glassBaseColor} onChange={(e) => setGlassBaseColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    <span className="text-xs font-mono">{glassBaseColor}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-medium">Blur (backdrop-filter)</label><span className="text-sm text-muted-foreground">{glassBlur}px</span></div>
                <input type="range" min="0" max="40" value={glassBlur} onChange={(e) => setGlassBlur(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-medium">Saturation</label><span className="text-sm text-muted-foreground">{glassSaturate}%</span></div>
                <input type="range" min="0" max="250" value={glassSaturate} onChange={(e) => setGlassSaturate(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-medium">Card Opacity</label><span className="text-sm text-muted-foreground">{glassOpacity}</span></div>
                <input type="range" min="0" max="1" step="0.01" value={glassOpacity} onChange={(e) => setGlassOpacity(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 block">Card Color</label>
                  <div className="flex items-center space-x-2">
                    <input type="color" value={glassColor} onChange={(e) => setGlassColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    <span className="text-xs border p-1 rounded font-mono uppercase bg-muted/50">{glassColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><label className="text-sm font-medium text-xs">Border Edge Opacity</label><span className="text-xs text-muted-foreground">{glassBorderOpacity}</span></div>
                  <input type="range" min="0" max="1" step="0.01" value={glassBorderOpacity} onChange={(e) => setGlassBorderOpacity(Number(e.target.value))} className="w-full accent-primary" />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Preview Column */}
        <div className="space-y-6">
          <Card 
            className={`p-6 md:p-12 flex items-center justify-center min-h-[400px] overflow-hidden border border-border/50
              ${activeTab === 'box-shadow' ? '' : ''}
              ${activeTab === 'glass' && glassBgType === 'color' ? '' : ''}
              ${activeTab === 'gradient' ? 'bg-dot-pattern bg-[length:20px_20px]' : ''}
            `}
            style={
              activeTab === 'box-shadow' ? { backgroundColor: bgColor } 
              : activeTab === 'glass' ? (glassBgType === 'image' ? { backgroundImage: `url('${glassBgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: glassBaseColor })
              : {}
            }
          >
            {/* The actual preview element */}
            {activeTab === 'glass' ? (
              <div className="w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden" style={previewStyle}>
                 <div className="p-8 text-center text-white space-y-4">
                    <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center shadow-inner backdrop-blur-md mb-4">
                      <div className="w-10 h-10 bg-white/40 rounded-full"></div>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight drop-shadow-md">Glass Effect</h3>
                    <p className="text-sm opacity-90 font-medium">Adjust the sliders to fine-tune the backdrop filter properties.</p>
                 </div>
              </div>
            ) : (
              <div 
                className={`${activeTab === 'box-shadow' ? 'w-48 h-48 rounded-xl' : 'w-full h-full min-h-[300px] rounded-3xl shadow-inner border border-black/5'}`}
                style={previewStyle}
              ></div>
            )}
            
          </Card>

          <Card className="overflow-hidden border border-border/50">
            <div className="bg-muted px-4 py-3 flex items-center justify-between border-b border-border">
              <span className="text-sm font-medium text-muted-foreground">Output</span>
              <Button size="sm" variant="outline" onClick={() => handleCopy(currentCode)} className="h-8">
                {copied ? <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <div className="p-4 bg-background overflow-x-auto min-h-[100px]">
              <pre className="text-sm font-mono text-foreground whitespace-pre-wrap word-break">
                {currentCode}
              </pre>
            </div>
          </Card>
        </div>

      </div>
    </ToolLayout>
  );
}
