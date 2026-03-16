import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Copy, CheckCircle2, Terminal } from 'lucide-react';
import { Input } from '../components/ui/Input';
import ToolLayout from '../components/ToolLayout';

const gitCommands = [
  {
    category: 'Setup & Init',
    commands: [
      { name: 'Initialize Repository', cmd: 'git init', desc: 'Initialize a new local Git repository' },
      { name: 'Clone Repository', cmd: 'git clone <url>', desc: 'Clone an existing repository into a new directory' },
      { name: 'Set Username', cmd: 'git config --global user.name "John Doe"', desc: 'Define author name for commits' },
      { name: 'Set Email', cmd: 'git config --global user.email "john@example.com"', desc: 'Define author email for commits' },
    ]
  },
  {
    category: 'Stage & Snapshot',
    commands: [
      { name: 'Status', cmd: 'git status', desc: 'Show the working tree status' },
      { name: 'Add Specific File', cmd: 'git add <file>', desc: 'Add a file to the staging area' },
      { name: 'Add All', cmd: 'git add .', desc: 'Add all modified and new files to the staging area' },
      { name: 'Commit', cmd: 'git commit -m "Commit message"', desc: 'Record changes to the repository' },
      { name: 'Diff', cmd: 'git diff', desc: 'Show changes between working tree and index' },
    ]
  },
  {
    category: 'Branch & Merge',
    commands: [
      { name: 'List Branches', cmd: 'git branch', desc: 'List all local branches' },
      { name: 'Create Branch', cmd: 'git branch <branch>', desc: 'Create a new branch' },
      { name: 'Switch Branch', cmd: 'git switch <branch>', desc: 'Switch to a specific branch' },
      { name: 'Create & Switch', cmd: 'git switch -c <branch>', desc: 'Create a new branch and switch to it' },
      { name: 'Merge', cmd: 'git merge <branch>', desc: 'Merge the specified branch into the current branch' },
    ]
  },
  {
    category: 'Share & Update',
    commands: [
      { name: 'Add Remote', cmd: 'git remote add origin <url>', desc: 'Add a new remote repository' },
      { name: 'Fetch', cmd: 'git fetch', desc: 'Download objects and refs from another repository' },
      { name: 'Pull', cmd: 'git pull', desc: 'Fetch from and integrate with another repository or a local branch' },
      { name: 'Push', cmd: 'git push origin <branch>', desc: 'Update remote refs along with associated objects' },
      { name: 'Push (Set upstream)', cmd: 'git push -u origin <branch>', desc: 'Push and set upstream tracking' },
    ]
  },
  {
    category: 'Inspect & Compare',
    commands: [
      { name: 'Log', cmd: 'git log', desc: 'Show commit logs' },
      { name: 'Log Oneline', cmd: 'git log --oneline', desc: 'Show commit logs in a compact format' },
      { name: 'Show Commit', cmd: 'git show <commit>', desc: 'Show various types of objects' },
      { name: 'List Tags', cmd: 'git tag', desc: 'List available tags' },
    ]
  },
  {
    category: 'Rewrite History',
    commands: [
      { name: 'Rebase', cmd: 'git rebase <branch>', desc: 'Reapply commits on top of another base tip' },
      { name: 'Interactive Rebase', cmd: 'git rebase -i <commit>', desc: 'Interactively rebase commits up to the specified commit' },
      { name: 'Reset (Soft)', cmd: 'git reset --soft HEAD~1', desc: 'Undo last commit, keep changes staged' },
      { name: 'Reset (Hard)', cmd: 'git reset --hard HEAD~1', desc: 'Undo last commit, DISCARD all changes' },
    ]
  }
];

export default function GitCheatsheet() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCmd, setCopiedCmd] = useState(null);

  // Command Builder State
  const [commitMsg, setCommitMsg] = useState('');
  const [addAll, setAddAll] = useState(false);
  const [amend, setAmend] = useState(false);
  const [noVerify, setNoVerify] = useState(false);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const getFilteredCommands = () => {
    if (!searchQuery) return gitCommands;
    const query = searchQuery.toLowerCase();
    
    return gitCommands.map(category => ({
      ...category,
      commands: category.commands.filter(cmd => 
        cmd.name.toLowerCase().includes(query) || 
        cmd.desc.toLowerCase().includes(query) ||
        cmd.cmd.toLowerCase().includes(query)
      )
    })).filter(category => category.commands.length > 0);
  };

  const filteredCommands = getFilteredCommands();

  const generateCommitCommand = () => {
    let cmd = 'git commit';
    if (addAll) cmd += ' -a';
    if (amend) cmd += ' --amend';
    if (noVerify) cmd += ' --no-verify';
    if (commitMsg) {
      // Escape quotes if needed
      const msg = commitMsg.replace(/"/g, '\\"');
      cmd += ` -m "${msg}"`;
    } else if (!amend) {
      cmd += ' -m "your message here"';
    }
    return cmd;
  };

  const generatedCommit = generateCommitCommand();

  return (
    <ToolLayout
      title="Git Command Cheatsheet"
      description="Search common Git commands and build interactive git snippets."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Builder & Search */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border bg-muted/30">
              <CardTitle className="text-lg flex items-center">
                <Terminal className="h-4 w-4 mr-2" />
                Commit Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Commit Message</label>
                <Input 
                  placeholder="e.g. Fix button alignment" 
                  value={commitMsg}
                  onChange={(e) => setCommitMsg(e.target.value)}
                />
              </div>
              <div className="space-y-2 pt-2">
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={addAll} onChange={e => setAddAll(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span>Stage All Modified (-a)</span>
                </label>
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={amend} onChange={e => setAmend(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span>Amend Previous (--amend)</span>
                </label>
                <label className="flex items-center space-x-2 text-sm cursor-pointer border-t pt-2 mt-2">
                  <input type="checkbox" checked={noVerify} onChange={e => setNoVerify(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span>Skip Hooks (--no-verify)</span>
                </label>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-md relative group">
                <code className="text-sm font-mono break-all">{generatedCommit}</code>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  onClick={() => handleCopy(generatedCommit, 'builder')}
                >
                  {copiedCmd === 'builder' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search commands..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column: Cheatsheet List */}
        <div className="lg:col-span-2 space-y-6">
          {filteredCommands.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg bg-card text-sm">
              No commands found matching "{searchQuery}"
            </div>
          ) : (
            filteredCommands.map((category, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 border-b border-border">
                  <h3 className="font-semibold text-sm">{category.category}</h3>
                </div>
                <div className="divide-y divide-border">
                  {category.commands.map((cmd, cmdIdx) => {
                    const id = `cmd-${idx}-${cmdIdx}`;
                    return (
                      <div key={cmdIdx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors group">
                        <div className="space-y-1 flex-1">
                          <div className="font-medium text-sm text-foreground">{cmd.name}</div>
                          <div className="text-xs text-muted-foreground">{cmd.desc}</div>
                        </div>
                        <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md w-full sm:w-auto overflow-hidden relative">
                          <code className="text-xs font-mono text-foreground whitespace-nowrap overflow-x-auto flex-1 sm:max-w-[200px] md:max-w-xs scrollbar-none">
                            {cmd.cmd}
                          </code>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={() => handleCopy(cmd.cmd, id)}
                          >
                            {copiedCmd === id ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))
          )}
        </div>

      </div>
    </ToolLayout>
  );
}
