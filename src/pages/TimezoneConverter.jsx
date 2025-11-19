import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Clock, Trash2 } from 'lucide-react';

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
        <div className="flex items-center gap-4 p-4 bg-accent/10 border border-accent/50 rounded-base">
          <Clock className="w-8 h-8 text-accent" />
          <div>
            <div className="font-bold text-lg text-text">Local Time</div>
            <div className="font-mono text-xl text-text">{formatTime(baseTime, Intl.DateTimeFormat().resolvedOptions().timeZone)}</div>
            <div className="text-sm text-textSecondary">{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
          </div>
        </div>

        <div>
          <label className="block font-bold mb-2 text-textSecondary">Add Timezone</label>
          <select
            onChange={addZone}
            className="w-full font-bold"
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
            <div key={zone} className="flex justify-between items-center p-4 bg-slate-900/50 border border-white/10 rounded-base">
              <div>
                <div className="font-bold text-lg text-text">{zone.split('/').pop().replace('_', ' ')}</div>
                <div className="font-mono text-xl text-text">{formatTime(baseTime, zone)}</div>
                <div className="text-sm text-textSecondary">{zone}</div>
              </div>
              <button
                onClick={() => removeZone(zone)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-base transition-colors"
                title="Remove Timezone"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
