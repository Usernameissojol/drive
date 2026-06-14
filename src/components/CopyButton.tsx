'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="btn copybtn"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 12px',
        borderRadius: '10px',
        border: '0',
        cursor: 'pointer',
        fontWeight: '900',
        background: '#2563eb',
        color: '#fff',
        boxShadow: '0 14px 22px rgba(37,99,235,.18)',
        minWidth: '120px',
        fontFamily: 'inherit'
      }}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}
