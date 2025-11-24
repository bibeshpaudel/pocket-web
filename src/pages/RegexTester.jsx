import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardContent } from '../components/ui/Card';

export default function RegexTester() {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('gm');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (!regex) {
        setMatches([]);
        setError('');
        return;
      }
      const re = new RegExp(regex, flags);
      const found = [];
      let match;
      
      // Reset lastIndex for global matches
      if (flags.includes('g')) {
        while ((match = re.exec(text)) !== null) {
          found.push({
            index: match.index,
            match: match[0],
            groups: match.groups
          });
          if (match.index === re.lastIndex) {
            re.lastIndex++;
          }
        }
      } else {
        match = re.exec(text);
        if (match) {
          found.push({
            index: match.index,
            match: match[0],
            groups: match.groups
          });
        }
      }
      
      setMatches(found);
      setError('');
    } catch (err) {
      setError(err.message);
      setMatches([]);
    }
  }, [regex, flags, text]);

  return (
    <ToolLayout
      title="RegEx Tester"
      description="Test and debug regular expressions."
    >
      <div className="grid gap-6">
        <div className="grid md:grid-cols-[1fr_auto] gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Regular Expression</label>
            <Input
              type="text"
              className="font-mono"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              placeholder="e.g. [a-z]+"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Flags</label>
            <Input
              type="text"
              className="w-24 font-mono"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="gmi"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm font-medium">
            Error: {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Test String</label>
          <Textarea
            className="h-32 resize-y font-mono"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text to test against..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Matches ({matches.length})</label>
          <Card className="h-48 overflow-auto bg-muted/50">
            <CardContent className="p-4 font-mono text-sm">
              {matches.length > 0 ? (
                <ul className="space-y-2">
                  {matches.map((m, i) => (
                    <li key={i} className="p-2 bg-background rounded border border-border">
                      <span className="font-bold text-primary">Match {i + 1}:</span> "{m.match}" <span className="opacity-50 text-xs text-muted-foreground">(Index: {m.index})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="opacity-50 italic text-muted-foreground">No matches found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
