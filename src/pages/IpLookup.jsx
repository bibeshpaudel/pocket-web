import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Search, Globe, MapPin, Network, Trash2, Activity } from 'lucide-react';

export default function IpLookup() {
  const [ip, setIp] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myIp, setMyIp] = useState(null);

  useEffect(() => {
    fetchMyIp();
  }, []);

  const fetchMyIp = async () => {
    try {
      const res = await fetch('https://ipwho.is/');
      const json = await res.json();
      if (json.success) {
        setMyIp(json);
      }
    } catch (err) {
      console.error('Failed to fetch my IP');
    }
  };

  const lookupIp = async () => {
    if (!ip) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`https://ipwho.is/${ip}`);
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || 'Invalid IP/Domain');
      }
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const InfoCard = ({ title, value, icon: Icon }) => (
    <div className="p-4 bg-slate-900/50 border border-white/10 rounded-base hover:bg-slate-800/50 transition-colors group">
      <div className="flex items-center gap-2 mb-2 text-textSecondary group-hover:text-accent transition-colors">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-bold">{title}</span>
      </div>
      <div className="font-mono font-bold break-all text-text">{value || 'N/A'}</div>
    </div>
  );

  return (
    <ToolLayout
      title="IP & DNS Lookup"
      description="Get detailed information about IP addresses and domains."
    >
      <div className="grid gap-8">
        {myIp && (
          <div className="p-6 bg-accent/10 border border-accent/30 rounded-base relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-24 h-24 text-accent" />
            </div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-accent">
              <Activity className="w-5 h-5" /> Your Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              <InfoCard title="IP Address" value={myIp.ip} icon={Network} />
              <InfoCard title="Location" value={`${myIp.city}, ${myIp.country}`} icon={MapPin} />
              <InfoCard title="ISP" value={myIp.connection?.isp || myIp.connection?.org} icon={Globe} />
              <InfoCard title="Timezone" value={myIp.timezone?.id} icon={Globe} />
            </div>
          </div>
        )}

        <div>
          <label className="block font-bold mb-2 text-textSecondary">Lookup IP or Domain</label>
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full p-3 pl-10 bg-slate-900/50 border border-white/10 rounded-base font-mono focus:outline-none focus:border-accent transition-colors text-text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="e.g. 8.8.8.8 or google.com"
                onKeyDown={(e) => e.key === 'Enter' && lookupIp()}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            </div>
            <button
              onClick={lookupIp}
              disabled={loading}
              className="bg-accent hover:bg-accentHover text-white px-6 border border-white/10 rounded-base transition-colors font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
            >
              {loading ? 'Searching...' : 'Lookup'}
            </button>
            <button
              onClick={() => { setIp(''); setData(null); setError(''); }}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 border border-red-500/50 rounded-base transition-colors font-bold flex items-center justify-center"
              title="Clear"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 text-red-200 border border-red-500/50 rounded-base font-bold">
            Error: {error}
          </div>
        )}

        {data && (
          <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-lg text-textSecondary">Results for <span className="text-text">{ip}</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard title="IP Address" value={data.ip} icon={Network} />
              <InfoCard title="Network" value={data.connection?.isp || data.connection?.org} icon={Network} />
              <InfoCard title="Type" value={data.type} icon={Network} />
              <InfoCard title="City" value={data.city} icon={MapPin} />
              <InfoCard title="Region" value={data.region} icon={MapPin} />
              <InfoCard title="Country" value={data.country} icon={MapPin} />
              <InfoCard title="Postal Code" value={data.postal} icon={MapPin} />
              <InfoCard title="Latitude/Longitude" value={`${data.latitude}, ${data.longitude}`} icon={MapPin} />
              <InfoCard title="Timezone" value={data.timezone?.id} icon={Globe} />
              <InfoCard title="Calling Code" value={data.calling_code} icon={Globe} />
              <InfoCard title="ASN" value={data.connection?.asn} icon={Network} />
              <InfoCard title="Org" value={data.connection?.org} icon={Network} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
