import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, Check } from 'lucide-react';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [dateString, setDateString] = useState('');
  const [isoString, setIsoString] = useState('');
  const [copiedDate, setCopiedDate] = useState(false);
  const [copiedIso, setCopiedIso] = useState(false);

  useEffect(() => {
    updateFromTimestamp(timestamp);
  }, []);

  const updateFromTimestamp = (ts) => {
    setTimestamp(ts);
    try {
      const date = new Date(ts * 1000);
      setDateString(date.toLocaleString());
      setIsoString(date.toISOString());
    } catch (e) {
      setDateString('Invalid Date');
      setIsoString('Invalid Date');
    }
  };

  const handleTimestampChange = (e) => {
    const val = Number(e.target.value);
    updateFromTimestamp(val);
  };

  const handleDateChange = (e) => {
    const val = e.target.value; // YYYY-MM-DDTHH:mm
    if (val) {
      const date = new Date(val);
      const ts = Math.floor(date.getTime() / 1000);
      updateFromTimestamp(ts);
    }
  };

  const setCurrentTime = () => {
    updateFromTimestamp(Math.floor(Date.now() / 1000));
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'date') {
      setCopiedDate(true);
      setTimeout(() => setCopiedDate(false), 2000);
    } else {
      setCopiedIso(true);
      setTimeout(() => setCopiedIso(false), 2000);
    }
  };

  return (
    <ToolLayout
      title="Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates."
    >
      <div className="grid gap-8">
        <div className="p-6 bg-accent/10 border border-accent/50 rounded-base text-center">
          <p className="font-bold mb-2 text-accent">Current Unix Timestamp</p>
          <div className="text-4xl font-mono font-bold text-text">{Math.floor(Date.now() / 1000)}</div>
        </div>

        <div className="grid gap-6">
          <div>
            <label className="block font-bold mb-2 text-textSecondary">Unix Timestamp (Seconds)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={timestamp}
                onChange={handleTimestampChange}
                className="flex-grow font-mono text-lg"
              />
              <button
                onClick={setCurrentTime}
                className="bg-accent hover:bg-accentHover text-white px-4 rounded-base font-bold transition-colors"
              >
                Now
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-bold text-textSecondary">Human Readable (Local)</label>
                <button onClick={() => copyToClipboard(dateString, 'date')} className="text-xs flex items-center gap-1 hover:text-accent transition-colors">
                  {copiedDate ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedDate ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-3 bg-slate-900/50 border border-white/10 rounded-base font-mono text-text">
                {dateString}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-bold text-textSecondary">ISO 8601 (UTC)</label>
                <button onClick={() => copyToClipboard(isoString, 'iso')} className="text-xs flex items-center gap-1 hover:text-accent transition-colors">
                  {copiedIso ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedIso ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-3 bg-slate-900/50 border border-white/10 rounded-base font-mono text-text">
                {isoString}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2 text-textSecondary">Date Picker</label>
            <input
              type="datetime-local"
              onChange={handleDateChange}
              onClick={(e) => e.target.showPicker()}
              className="w-full font-mono dark:[color-scheme:dark] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
