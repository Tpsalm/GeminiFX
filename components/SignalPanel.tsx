
import React from 'react';
import { TradeSignal, SignalType } from '../types';
import { CheckCircle2, XCircle, ArrowRightLeft, RefreshCcw, Loader2, Rocket } from 'lucide-react';

interface Props {
  signal: TradeSignal | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const SignalPanel: React.FC<Props> = ({ signal, isLoading, onRefresh }) => {
  if (!signal && !isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <div className="bg-slate-800/50 p-4 rounded-full mb-4">
          <Rocket size={32} className="text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-2">No Active Signal</h3>
        <p className="text-sm text-slate-500 mb-6 max-w-[200px]">
          Click the button below to trigger the Gemini AI engine for market analysis.
        </p>
        <button 
          onClick={onRefresh}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
        >
          Generate Signal
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center h-full min-h-[400px]">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <h3 className="text-lg font-bold text-slate-200">Synthesizing Market Data</h3>
        <p className="text-sm text-slate-500">Gemini 3 Pro is calculating entry points...</p>
      </div>
    );
  }

  const isBuy = signal?.type === SignalType.BUY;
  const isNeutral = signal?.type === SignalType.NEUTRAL;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl h-full flex flex-col">
      <div className={`p-6 ${isNeutral ? 'bg-slate-800' : isBuy ? 'bg-emerald-600/10' : 'bg-rose-600/10'} border-b border-slate-800`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-1">Status Report</span>
            <div className="flex items-center gap-2">
              {isBuy ? <CheckCircle2 className="text-emerald-500" size={20} /> : isNeutral ? <ArrowRightLeft className="text-slate-400" size={20} /> : <XCircle className="text-rose-500" size={20} />}
              <h3 className={`text-xl font-black uppercase tracking-tight ${isBuy ? 'text-emerald-400' : isNeutral ? 'text-slate-200' : 'text-rose-400'}`}>
                {signal?.type} RECOMMENDATION
              </h3>
            </div>
          </div>
          <div className="bg-slate-950 px-3 py-1 rounded text-[10px] font-mono font-bold text-blue-400 border border-blue-900/50">
            {signal?.timestamp}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Confidence</p>
            <p className="text-lg font-bold text-slate-200">{signal?.confidence}%</p>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Pair</p>
            <p className="text-lg font-bold text-slate-200">EUR/USD</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 flex-grow">
        <div className="space-y-3">
          <SignalMetric label="Entry Price" value={signal?.entry.toFixed(5) || '0'} bold />
          <SignalMetric label="Take Profit" value={signal?.takeProfit.toFixed(5) || '0'} color="text-emerald-400" />
          <SignalMetric label="Stop Loss" value={signal?.stopLoss.toFixed(5) || '0'} color="text-rose-400" />
        </div>

        <div className="h-px bg-slate-800 my-4"></div>

        <div>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">AI Logic & Thesis</h4>
          <p className="text-xs leading-relaxed text-slate-400 font-medium italic">
            "{signal?.reasoning}"
          </p>
        </div>
      </div>

      <button 
        onClick={onRefresh}
        className="m-4 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-700"
      >
        <RefreshCcw size={14} /> Re-Evaluate Market
      </button>
    </div>
  );
};

const SignalMetric = ({ label, value, color = "text-slate-200", bold = false }: any) => (
  <div className="flex justify-between items-center">
    <span className="text-xs text-slate-500 font-medium uppercase tracking-tighter">{label}</span>
    <span className={`font-mono text-sm ${color} ${bold ? 'font-black' : 'font-bold'}`}>{value}</span>
  </div>
);

export default SignalPanel;
