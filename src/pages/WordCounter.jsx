import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    sentences: 0,
    paragraphs: 0,
  });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;

    setStats({ words, characters, sentences, paragraphs });
  }, [text]);

  return (
    <ToolLayout
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs in real-time."
    >
      <div className="grid gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-3xl font-bold text-primary">{stats.words}</div>
              <div className="text-sm font-medium text-muted-foreground">Words</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-3xl font-bold">{stats.characters}</div>
              <div className="text-sm font-medium text-muted-foreground">Characters</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-3xl font-bold">{stats.sentences}</div>
              <div className="text-sm font-medium text-muted-foreground">Sentences</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-3xl font-bold">{stats.paragraphs}</div>
              <div className="text-sm font-medium text-muted-foreground">Paragraphs</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Text Input</label>
          <Textarea
            className="h-64 resize-y"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste text here..."
          />
        </div>
      </div>
    </ToolLayout>
  );
}
