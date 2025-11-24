import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Copy, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

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
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <p className="font-bold mb-2 text-primary">Current Unix Timestamp</p>
            <div className="text-4xl font-mono font-bold">{Math.floor(Date.now() / 1000)}</div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Unix Timestamp (Seconds)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={timestamp}
                onChange={handleTimestampChange}
                className="flex-grow font-mono text-lg"
              />
              <Button onClick={setCurrentTime}>
                Now
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium leading-none">Human Readable (Local)</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(dateString, 'date')}
                  className="h-6 px-2 text-xs"
                >
                  {copiedDate ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                  {copiedDate ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="p-3 bg-muted rounded-md border border-input font-mono text-sm">
                {dateString}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium leading-none">ISO 8601 (UTC)</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(isoString, 'iso')}
                  className="h-6 px-2 text-xs"
                >
                  {copiedIso ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                  {copiedIso ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="p-3 bg-muted rounded-md border border-input font-mono text-sm">
                {isoString}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Date Picker</label>
            <Input
              type="datetime-local"
              onChange={handleDateChange}
              onClick={(e) => e.target.showPicker()}
              className="w-full font-mono cursor-pointer"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
