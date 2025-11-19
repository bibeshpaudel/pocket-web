import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';

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
          <div>
            <label className="block font-bold mb-2">Content</label>
            <textarea
              className="w-full p-3 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base focus:outline-none focus:shadow-light dark:focus:shadow-dark transition-shadow"
              rows="4"
              placeholder="Enter text or URL..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Size (px)</label>
            <input
              type="number"
              min="128"
              max="1024"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full p-3 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-2">Foreground</label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full h-12 p-1 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base cursor-pointer"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Background</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-12 p-1 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base">
          {text ? (
            <>
              <div className="bg-white p-4 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark mb-6">
                <QRCodeCanvas
                  id="qr-canvas"
                  value={text}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                />
              </div>
              <button
                onClick={downloadQr}
                className="flex items-center gap-2 bg-main text-text px-6 py-3 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark hover:translate-x-box hover:translate-y-box hover:shadow-none dark:hover:shadow-none transition-all font-bold"
              >
                <Download className="w-5 h-5" /> Download PNG
              </button>
            </>
          ) : (
            <div className="text-center opacity-50">
              <p className="font-bold text-xl mb-2">No Content</p>
              <p>Enter text to generate QR code</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
