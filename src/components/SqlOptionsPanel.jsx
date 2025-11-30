import React from 'react';
import { Database, Table, Key, Trash2, Copy, Check } from 'lucide-react';

export default function SqlOptionsPanel({ options, onOptionsChange, headers, onGenerate, sql }) {
  const [copied, setCopied] = React.useState(false);

  const handleChange = (key, value) => {
    onOptionsChange({ ...options, [key]: value });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="flex flex-col h-full border-l border-border bg-card w-80 flex-shrink-0">
      <div className="p-4 border-b border-border font-semibold flex items-center gap-2">
        <Database size={18} />
        SQL Options
      </div>
      
      <div className="p-4 flex flex-col gap-6 overflow-y-auto flex-grow">
        {/* Dialect */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">Database Dialect</label>
          <select
            value={options.dialect}
            onChange={(e) => handleChange('dialect', e.target.value)}
            className="p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary text-sm"
          >
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="sqlite">SQLite</option>
            <option value="sqlserver">SQL Server</option>
          </select>
        </div>

        {/* Table Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">Table Name</label>
          <div className="relative">
            <input
              type="text"
              value={options.tableName}
              onChange={(e) => handleChange('tableName', e.target.value)}
              placeholder="my_table"
              className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        {/* Primary Key */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">Primary Key (Optional)</label>
          <div className="relative">
            <select
              value={options.primaryKey || ''}
              onChange={(e) => handleChange('primaryKey', e.target.value)}
              className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary text-sm"
            >
              <option value="">-- None --</option>
              {headers.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={options.dropTable}
              onChange={(e) => handleChange('dropTable', e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span>Add DROP TABLE IF EXISTS</span>
          </label>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-border mt-auto">
            <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied Preview!' : 'Copy Preview'}
            </button>
        </div>
      </div>
    </div>
  );
}
