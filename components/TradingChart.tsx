
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PriceData, TradeSignal, SignalType } from '../types';

interface Props {
  data: PriceData[];
  pair: string;
  activeSignal: TradeSignal | null;
}

const TradingChart: React.FC<Props> = ({ data, pair, activeSignal }) => {
  const minPrice = Math.min(...data.map(d => d.low)) * 0.9999;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.0001;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs font-mono">
          <p className="text-slate-400 mb-1">{label}</p>
          <p className="text-blue-400">Price: {payload[0].value.toFixed(5)}</p>
          {payload[1] && <p className="text-purple-400">EMA20: {payload[1].value.toFixed(5)}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[500px] p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold font-mono tracking-tighter text-slate-100">{pair}</h2>
          <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 font-mono">M5 TIMEFRAME</span>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Price
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-semibold">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> EMA (20)
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#475569', fontSize: 10 }}
            interval={5}
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#475569', fontSize: 10 }}
            orientation="right"
            tickFormatter={(v) => v.toFixed(4)}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Area 
            type="monotone" 
            dataKey="close" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={300}
          />
          
          <Area 
            type="monotone" 
            dataKey="ema20" 
            stroke="#a855f7" 
            strokeWidth={1.5}
            strokeDasharray="5 5"
            fill="transparent"
            animationDuration={300}
          />

          {activeSignal && activeSignal.type !== SignalType.NEUTRAL && (
            <>
              <ReferenceLine 
                y={activeSignal.entry} 
                stroke="#94a3b8" 
                strokeDasharray="3 3" 
                label={{ position: 'left', value: 'ENTRY', fill: '#94a3b8', fontSize: 9 }} 
              />
              <ReferenceLine 
                y={activeSignal.takeProfit} 
                stroke="#10b981" 
                strokeDasharray="3 3" 
                label={{ position: 'left', value: 'TP', fill: '#10b981', fontSize: 9 }} 
              />
              <ReferenceLine 
                y={activeSignal.stopLoss} 
                stroke="#ef4444" 
                strokeDasharray="3 3" 
                label={{ position: 'left', value: 'SL', fill: '#ef4444', fontSize: 9 }} 
              />
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradingChart;
