
import React, { useState } from 'react';
import { TradeSignal } from '../types';
import { Code, Copy, Check, Download } from 'lucide-react';

interface Props {
  signal: TradeSignal | null;
}

const Mql5Exporter: React.FC<Props> = ({ signal }) => {
  const [copied, setCopied] = useState(false);

  const mqlCode = `//+------------------------------------------------------------------+
//|                                              GeminiFX_Signal.mq5 |
//|                                  Copyright 2024, GeminiFX Pro    |
//|                                             https://example.com  |
//+------------------------------------------------------------------+
#property copyright "GeminiFX AI"
#property version   "1.00"
#property strict

// Signal Data from Gemini AI
double EntryLevel = ${signal?.entry || 0};
double TPLevel    = ${signal?.takeProfit || 0};
double SLLevel    = ${signal?.stopLoss || 0};
string SignalType = "${signal?.type || 'NONE'}";

void OnTick()
{
   // Implementation for MT5 integration
   if(SignalType == "BUY" && SymbolInfoDouble(_Symbol, SYMBOL_ASK) <= EntryLevel)
   {
      // Insert execution logic here
   }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code size={18} className="text-blue-400" />
          <h3 className="text-sm font-bold text-slate-200">MQL5 Integration Script</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
            title="Copy to Clipboard"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>
      <div className="p-4 bg-slate-950">
        <pre className="text-[10px] text-emerald-500/80 font-mono leading-relaxed overflow-x-auto">
          {mqlCode}
        </pre>
      </div>
      <div className="p-3 bg-blue-900/10 text-center">
        <p className="text-[10px] text-blue-400 font-medium">
          Note: Copy this snippet into your MT5 MetaEditor to automate the generated AI signal.
        </p>
      </div>
    </div>
  );
};

export default Mql5Exporter;
