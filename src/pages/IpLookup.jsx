import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Search, Globe, MapPin, Network, Trash2, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

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
      // Remove protocol and path if present
      let targetIp = ip.replace(/^https?:\/\//, '').split('/')[0];
      
      // Check if input is a domain (contains letters)
      if (/[a-zA-Z]/.test(targetIp)) {
        const dnsRes = await fetch(`https://dns.google/resolve?name=${targetIp}`);
        const dnsJson = await dnsRes.json();
        
        if (dnsJson.Status !== 0 || !dnsJson.Answer) {
          throw new Error('Could not resolve domain');
        }
        
        // Find the first A record (type 1)
        const aRecord = dnsJson.Answer.find(r => r.type === 1);
        if (!aRecord) {
          throw new Error('No A record found for domain');
        }
        targetIp = aRecord.data;
      }

      const res = await fetch(`https://ipwho.is/${targetIp}`);
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
    <Card className="hover:bg-muted/50 transition-colors group">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground group-hover:text-primary transition-colors">
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="font-mono font-bold break-all">{value || 'N/A'}</div>
      </CardContent>
    </Card>
  );

  return (
    <ToolLayout
      title="IP & DNS Lookup"
      description="Get detailed information about IP addresses and domains."
    >
      <div className="grid gap-8">
        {myIp && (
          <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Activity className="w-24 h-24 text-primary" />
            </div>
            <CardContent className="p-6 relative z-10">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-primary">
                <Activity className="w-5 h-5" /> Your Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">IP Address</div>
                  <div className="font-mono font-bold">{myIp.ip}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">Location</div>
                  <div className="font-bold">{`${myIp.city}, ${myIp.country}`}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">ISP</div>
                  <div className="font-bold">{myIp.connection?.isp || myIp.connection?.org}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">Timezone</div>
                  <div className="font-bold">{myIp.timezone?.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Lookup IP or Domain</label>
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                className="pl-10 font-mono"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="e.g. 8.8.8.8 or google.com"
                onKeyDown={(e) => e.key === 'Enter' && lookupIp()}
              />
            </div>
            <Button
              onClick={lookupIp}
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? 'Searching...' : 'Lookup'}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => { setIp(''); setData(null); setError(''); }}
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md font-medium">
            Error: {error}
          </div>
        )}

        {data && (
          <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-lg text-muted-foreground">Results for <span className="text-foreground">{ip}</span></h3>
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
