import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardContent } from '../components/ui/Card';

export default function QrGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const downloadQr = () => {
    const canvas = document.getElementById('qr-canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Generate customizable QR codes for text or URLs."
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Content</label>
            <Textarea
              className="resize-none"
              rows="4"
              placeholder="Enter text or URL..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Size (px)</label>
            <Input
              type="number"
              min="128"
              max="1024"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Foreground</label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-10 w-12 p-1 cursor-pointer"
                />
                <Input 
                  type="text" 
                  value={fgColor} 
                  onChange={(e) => setFgColor(e.target.value)}
                  className="font-mono uppercase"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Background</label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-12 p-1 cursor-pointer"
                />
                <Input 
                  type="text" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="font-mono uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        <Card className="flex flex-col items-center justify-center p-8 min-h-[400px]">
          <CardContent className="flex flex-col items-center justify-center space-y-6 p-0">
            {text ? (
              <>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <QRCodeCanvas
                    id="qr-canvas"
                    value={text}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                  />
                </div>
                <Button onClick={downloadQr} className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" /> Download PNG
                </Button>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="font-medium text-lg mb-2">No Content</p>
                <p className="text-sm">Enter text to generate QR code</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
