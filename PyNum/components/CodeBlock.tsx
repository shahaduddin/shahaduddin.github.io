import React from 'react';
import { Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'python' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-b-lg overflow-hidden border border-t-0 border-slate-200 bg-slate-50 font-mono text-sm shadow-sm">
      <div className="absolute top-2 right-2 z-10">
        <button 
          onClick={handleCopy}
          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-md transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
          title="Copy code"
        >
          {copied ? <span className="text-emerald-600 text-xs font-bold">Copied!</span> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-5 overflow-x-auto">
        <pre className="text-slate-800 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};