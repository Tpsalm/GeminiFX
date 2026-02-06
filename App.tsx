
import React, { useState, useEffect, useCallback, useRef } from 'react';
import TradingChart from './components/TradingChart';
import SignalPanel from './components/SignalPanel';
import IndicatorPanel from './components/IndicatorPanel';
import Mql5Exporter from './components/Mql5Exporter';
import { PriceData, MarketState, TradeSignal, SignalType } from './types';
import { analyzeMarket } from './services/geminiService';
import { LayoutGrid, TrendingUp, ShieldAlert, Cpu, Activity, Info } from 'lucide-react';

const INITIAL_PRICE = 1.0850; // EUR/USD baseline
const UPDATE_INTERVAL = 3000; // 3 seconds

const App: React.FC = () => {
  const [market, setMarket] = useState<MarketState>({
    currentPrice: INITIAL_PRICE,
    change24h: 0.25,
    lastUpdate: new Date().toLocaleTimeString(),
    history: []
  });
  const [activeSignal, setActiveSignal] = useState<TradeSignal | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pair, setPair] = useState("EUR/USD");

  const historyRef = useRef<PriceData[]>([]);

  // Simulation Logic
  const generateNextPrice = useCallback((prev: number): PriceData => {
    const volatility = 0.0004;
    const change = (Math.random() - 0.5) * volatility;
    const nextClose = prev + change;
    const high = Math.max(prev, nextClose) + Math.random() * 0.0001;
    const low = Math.min(prev, nextClose) - Math.random() * 0.0001;
    
    // Simplified Indicators
    const rsi = 40 + Math.random() * 20; 
    const ema20 = nextClose * 0.9998;

    return {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      open: prev,
      high,
      low,
      close: nextClose,
      volume: Math.floor(Math.random() * 5000),
      rsi,
      ema20
    };
  }, []);

  useEffect(() => {
    // Initial history
    let last = INITIAL_PRICE;
    const initialHistory = Array.from({ length: 40 }).map(() => {
      const p = generateNextPrice(last);
      last = p.close;
      return p;
    });
    setMarket(prev => ({ ...prev, history: initialHistory, currentPrice: last }));
    historyRef.current = initialHistory;

    const interval = setInterval(() => {
      setMarket(prev => {
        const next = generateNextPrice(prev.currentPrice);
        const updatedHistory = [...prev.history.slice(-49), next];
        historyRef.current = updatedHistory;
        return {
          ...prev,
          currentPrice: next.close,
          lastUpdate: new Date().toLocaleTimeString(),
          history: updatedHistory
        };
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [generateNextPrice]);

  const handleRunAnalysis = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    const signal = await analyzeMarket(historyRef.current, pair);
    setActiveSignal(signal);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Cpu size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              GeminiFX Pro
            </h1>
            <p className="text-xs text-slate-500 font-medium">MT5 COMPATIBLE AI ENGINE</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Current Pair</span>
            <select 
              className="bg-transparent text-sm font-bold border-none focus:ring-0 cursor-pointer text-slate-200"
              value={pair}
              onChange={(e) => setPair(e.target.value)}
            >
              <option value="EUR/USD">EUR/USD</option>
              <option value="GBP/USD">GBP/USD</option>
              <option value="USD/JPY">USD/JPY</option>
              <option value="XAU/USD">GOLD (XAU/USD)</option>
            </select>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Live Feed</span>
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className={`animate-pulse w-2 h-2 rounded-full bg-emerald-500`}></span>
              {market.currentPrice.toFixed(4)}
            </div>
          </div>
        </div>

        <button 
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-900/20 ${
            isAnalyzing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
          }`}
        >
          {isAnalyzing ? (
            <Activity className="animate-spin" size={18} />
          ) : (
            <TrendingUp size={18} />
          )}
          {isAnalyzing ? 'Analyzing...' : 'Generate AI Signal'}
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column: Stats & Indicators */}
        <div className="xl:col-span-1 space-y-6">
          <IndicatorPanel market={market} />
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
              <ShieldAlert size={16} className="text-orange-400" />
              Risk Metrics
            </h3>
            <div className="space-y-4">
              <RiskItem label="Volatility Index" value="Medium" color="text-emerald-400" />
              <RiskItem label="Sentiment Analysis" value="Bullish" color="text-emerald-400" />
              <RiskItem label="AI Confidence" value={activeSignal ? `${activeSignal.confidence}%` : "N/A"} color="text-blue-400" />
            </div>
          </div>
          <div className="bg-blue-950/20 border border-blue-900/30 rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-400 mb-2 uppercase tracking-wider">
              <Info size={16} />
              AI Insight
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              The Gemini 3 Pro engine analyzes RSI divergence, EMA cross, and support/resistance zones in real-time. 
              Always cross-reference signals with economic calendars.
            </p>
          </div>
        </div>

        {/* Center: Charting */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <TradingChart data={market.history} pair={pair} activeSignal={activeSignal} />
          </div>
          <Mql5Exporter signal={activeSignal} />
        </div>

        {/* Right Column: Signals */}
        <div className="xl:col-span-1">
          <SignalPanel signal={activeSignal} isLoading={isAnalyzing} onRefresh={handleRunAnalysis} />
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-800 p-8 text-center text-slate-600 text-xs">
        <p>© 2024 GeminiFX Pro • Financial disclaimer: Trading involves risk of loss. AI signals are educational.</p>
      </footer>
    </div>
  );
};

const RiskItem = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-500">{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

export default App;
