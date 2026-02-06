
export interface PriceData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  rsi?: number;
  ema20?: number;
  sma50?: number;
}

export enum SignalType {
  BUY = 'BUY',
  SELL = 'SELL',
  NEUTRAL = 'NEUTRAL'
}

export interface TradeSignal {
  type: SignalType;
  entry: number;
  takeProfit: number;
  stopLoss: number;
  confidence: number;
  reasoning: string;
  timestamp: string;
}

export interface MarketState {
  currentPrice: number;
  change24h: number;
  lastUpdate: string;
  history: PriceData[];
}
