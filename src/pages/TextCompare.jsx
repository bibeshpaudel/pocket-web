import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { diffChars, diffWords, diffLines } from 'diff';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardContent } from '../components/ui/Card';
import ExpandableOutput from '../components/ExpandableOutput';

export default function TextCompare() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState([]);
  const [mode, setMode] = useState('chars');

  const compareText = () => {
    let diff;
    if (mode === 'chars') diff = diffChars(text1, text2);
    if (mode === 'words') diff = diffWords(text1, text2);
    if (mode === 'lines') diff = diffLines(text1, text2);
    setDiffResult(diff);
  };

  return (
    <ToolLayout
      title="Text Comparison"
      description="Compare two blocks of text and highlight differences."
    >
      <div className="grid gap-6">
        <div className="flex justify-center mb-4">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {['chars', 'words', 'lines'].map((m) => (
              <Button
                key={m}
                variant={mode === m ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode(m)}
                className="capitalize font-bold"
              >
                {m}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Original Text</label>
            <Textarea
              className="h-48 resize-none font-mono text-sm"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Paste original text..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Changed Text</label>
            <Textarea
              className="h-48 resize-none font-mono text-sm"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Paste changed text..."
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={compareText} size="lg" className="px-8">
            Compare Text
          </Button>
        </div>

        {diffResult.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Comparison Result</label>
            <ExpandableOutput title="Comparison Result">
              <Card className="bg-muted/50 h-full overflow-auto">
                <CardContent className="p-4 font-mono text-sm whitespace-pre-wrap break-words">
                  {diffResult.map((part, index) => {
                    const color = part.added ? 'bg-green-500/20 text-green-600 dark:text-green-400' : part.removed ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-transparent';
                    return (
                      <span key={index} className={color}>
                        {part.value}
                      </span>
                    );
                  })}
                </CardContent>
              </Card>
            </ExpandableOutput>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
