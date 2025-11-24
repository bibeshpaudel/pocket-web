import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Clock, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export default function TimezoneConverter() {
  const [baseTime, setBaseTime] = useState(new Date());
  const [selectedZones, setSelectedZones] = useState([
    'UTC',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
  ]);

  // List of common timezones
  const timezones = Intl.supportedValuesOf('timeZone');

  useEffect(() => {
    const timer = setInterval(() => {
      setBaseTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addZone = (e) => {
    const zone = e.target.value;
    if (zone && !selectedZones.includes(zone)) {
      setSelectedZones([...selectedZones, zone]);
    }
  };

  const removeZone = (zone) => {
    setSelectedZones(selectedZones.filter((z) => z !== zone));
  };

  const formatTime = (date, zone) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <ToolLayout
      title="Timezone Converter"
      description="Compare time across different timezones."
    >
      <div className="grid gap-6">
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="flex items-center gap-4 p-6">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <div className="font-bold text-lg">Local Time</div>
              <div className="font-mono text-xl">{formatTime(baseTime, Intl.DateTimeFormat().resolvedOptions().timeZone)}</div>
              <div className="text-sm text-muted-foreground">{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Add Timezone</label>
          <select
            onChange={addZone}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-medium"
            defaultValue=""
          >
            <option value="" disabled>Select a timezone...</option>
            {timezones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4">
          {selectedZones.map((zone) => (
            <Card key={zone}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <div className="font-bold text-lg">{zone.split('/').pop().replace('_', ' ')}</div>
                  <div className="font-mono text-xl">{formatTime(baseTime, zone)}</div>
                  <div className="text-sm text-muted-foreground">{zone}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeZone(zone)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  title="Remove Timezone"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
