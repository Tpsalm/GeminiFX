
import React from 'react';
import { MarketState } from '../types';
import { Layers, Zap, Gauge } from 'lucide-react';

interface Props {
  market: MarketState;
}

const IndicatorPanel: React.FC<Props> = ({ market }) => {
  const latest = market.history[market.history.length - 1];
  const rsi = latest?.rsi || 0;

  const getRsiColor = (val: number) => {
    if (val > 70) return 'text-rose-400';
    if (val < 30) return 'text-emerald-400';
    return 'text-blue-400';
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-6">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
        <Gauge size={16} /> Technical Indicators
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        <IndicatorCard 
          icon={<Zap size={14} className="text-yellow-400" />}
          label="RSI (14)" 
          value={rsi.toFixed(2)} 
          status={rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral'}
          colorClass={getRsiColor(rsi)}
        />
        
        <IndicatorCard 
          icon={<Layers size={14} className="text-purple-400" />}
          label="EMA (20)" 
          value={latest?.ema20?.toFixed(5) || '0'} 
          status={latest?.close > (latest?.ema20 || 0) ? 'Above' : 'Below'}
          colorClass="text-purple-400"
        />
        
        <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex flex-col items-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold mb-2">RSI Range Meter</span>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
            <div style={{ width: `${rsi}%` }} className={`h-full ${rsi > 70 ? 'bg-rose-500' : rsi < 30 ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
          </div>
          <div className="w-full flex justify-between mt-1 text-[8px] font-mono text-slate-600">
            <span>0</span>
            <span>30</span>
            <span>70</span>
            <span>100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const IndicatorCard = ({ icon, label, value, status, colorClass }: any) => (
  <div className="flex justify-between items-center p-3 bg-slate-950/40 rounded-xl border border-slate-800">
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-[10px] text-slate-500 uppercase font-bold leading-none">{label}</p>
        <p className={`text-sm font-black font-mono mt-1 ${colorClass}`}>{value}</p>
      </div>
    </div>
    <div className="text-right">
      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-semibold">{status}</span>
    </div>
  </div>
);

export default IndicatorPanel;
