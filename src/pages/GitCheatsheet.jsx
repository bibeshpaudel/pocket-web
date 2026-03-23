import React from 'react';
import ToolLayout from '../components/ToolLayout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

import gitCheatsheetContent from '../components/git/git-cheatsheet.md?raw';

export default function GitCheatsheet() {
  return (
    <ToolLayout
      title="Git & GitHub Cheatsheet"
      description="A clean, comprehensive guide to Git commands, concepts, and workflows."
    >
      <div className="bg-card border border-border rounded-xl shadow-lg mt-4 overflow-hidden mb-12">
        <div className="p-6 md:p-10 prose prose-slate dark:prose-invert max-w-none 
          prose-pre:bg-[#0f172a] prose-pre:border prose-pre:border-border 
          prose-headings:scroll-mt-20 prose-a:text-primary hover:prose-a:text-primary/80 
          prose-img:rounded-md prose-img:border prose-img:border-border">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
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
            {gitCheatsheetContent}
          </ReactMarkdown>
        </div>
      </div>
    </ToolLayout>
  );
}
