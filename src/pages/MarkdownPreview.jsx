import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

import { Textarea } from '../components/ui/Textarea';
import { Card, CardContent } from '../components/ui/Card';
import ExpandableOutput from '../components/ExpandableOutput';

const defaultMarkdown = `# Markdown Previewer

This previewer supports **GitHub Flavored Markdown**, math, syntax highlighting, and more.

## Task Lists
- [x] Write code
- [ ] Write tests
- [ ] Deploy

## Tables
| Feature | Supported |
| :--- | :---: |
| GFM | Yes |
| Math | Yes |

## Math Equations
Inline math: $E = mc^2$

Block math:
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## Code Blocks
\`\`\`javascript
function greet(name) {
  console.log(\`Hello \${name}!\`);
}
\`\`\`

## HTML Support
<details>
<summary>Click to expand</summary>
It supports safe HTML rendering too!
</details>
`;

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);

  return (
    <ToolLayout
      title="Markdown Previewer"
      description="Write and preview Markdown in real-time."
    >
      <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-300px)] min-h-[500px]">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium leading-none">Markdown Input</label>
          <Textarea
            className="flex-grow resize-none font-mono text-sm"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium leading-none">Preview</label>
          <ExpandableOutput title="Markdown Preview">
            <Card className="flex-grow overflow-hidden h-full">
              <CardContent className="h-full overflow-auto p-6 prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[
                    rehypeKatex,
                    rehypeHighlight,
                    rehypeRaw,
                    [rehypeSanitize, {
                      ...defaultSchema,
                      attributes: {
                        ...defaultSchema.attributes,
                        div: [...(defaultSchema.attributes?.div || []), 'className', 'style'],
                        span: [...(defaultSchema.attributes?.span || []), 'className', 'style'],
                        code: [...(defaultSchema.attributes?.code || []), 'className'],
                      },
                    }]
                  ]}
                >
                  {markdown}
                </ReactMarkdown>
              </CardContent>
            </Card>
          </ExpandableOutput>
        </div>
      </div>
    </ToolLayout>
  );
}
