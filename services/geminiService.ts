
import { GoogleGenAI, Type } from "@google/genai";
import { PriceData, SignalType, TradeSignal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeMarket = async (data: PriceData[], pair: string): Promise<TradeSignal> => {
  const recentData = data.slice(-15).map(d => ({
    c: d.close,
    h: d.high,
    l: d.low,
    r: d.rsi?.toFixed(2),
    e: d.ema20?.toFixed(2)
  }));

  const prompt = `Analyze the following technical data for ${pair} Forex pair. 
  Recent OHLC & Indicators: ${JSON.stringify(recentData)}.
  Current Price: ${data[data.length - 1].close}.
  
  Provide a professional trading signal including Buy/Sell/Neutral recommendation, Entry, Take Profit (TP), Stop Loss (SL), and detailed technical reasoning.
  TP and SL should be realistic based on average true range (ATR) concepts for this pair.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['BUY', 'SELL', 'NEUTRAL'] },
            entry: { type: Type.NUMBER },
            takeProfit: { type: Type.NUMBER },
            stopLoss: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER, description: "Percentage between 0-100" },
            reasoning: { type: Type.STRING }
          },
          required: ["type", "entry", "takeProfit", "stopLoss", "confidence", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      ...result,
      timestamp: new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      type: SignalType.NEUTRAL,
      entry: data[data.length - 1].close,
      takeProfit: 0,
      stopLoss: 0,
      confidence: 0,
      reasoning: "Failed to connect to AI engine. Check API configuration.",
      timestamp: new Date().toLocaleTimeString()
    };
  }
};
