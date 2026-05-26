import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  TrendingUp, RefreshCw, ShoppingBag, DollarSign, Activity
} from "lucide-react";
import { PredictionResult } from "../types";

const CATEGORIES = [
  "保健食品 (Health & Supplement)",
  "美妝保養 (Cosmetics)",
  "日用百貨 (Groceries)",
  "流行服飾 (Fashion)",
  "3C旗艦 (Electronics)"
];

export default function PredictSection() {
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [currentPrice, setCurrentPrice] = useState(1280);
  const [promoMultiplier, setPromoMultiplier] = useState(1.5);
  const [seasonalEffect, setSeasonalEffect] = useState(0.2); // -0.5 to 0.5
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isMock, setIsMock] = useState(false);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCat,
          currentPrice,
          promoMultiplier,
          seasonalEffect
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setPrediction(resData.data);
        setIsMock(resData.isMock);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, [selectedCat]); // Auto re-fetch on cat change, other updates can use the manual button or slight debounce

  // Chart data formatting
  const chartData = prediction ? prediction.predictedSales.map((sales, index) => ({
    week: `第 ${index + 1} 週`,
    "預估銷量 (千件)": sales,
    "同期對比基售 (千件)": Math.round(sales * 0.8),
  })) : [];

  return (
    <div id="predict-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Parameters Panel */}
      <div className="lg:col-span-4 bg-white border-2 border-slate-900 rounded-none p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-[#ec008c] text-white border border-slate-900">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg uppercase tracking-tight">AI 預測參數調節器</h3>
          </div>
          <p className="text-xs text-slate-500 mb-6 font-medium">
            調校不同大數據指標，即時預估特定商品在 momo 平台的 24H 銷售表現與動態定價。
          </p>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
              選擇銷售品類 / CATEGORY
            </label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border-2 border-slate-900 rounded-none focus:outline-hidden focus:bg-white text-slate-900 transition-colors"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Current Price */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                商品參考原定價 / REFERENCE PRICE
              </label>
              <span className="text-sm font-black text-slate-900">
                NT$ {currentPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="15000"
              step="50"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-none appearance-none cursor-pointer accent-[#ec008c]"
            />
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 mt-1">
              <span>NT$ 100</span>
              <span>NT$ 15,000</span>
            </div>
          </div>

          {/* Promotion Multiplier */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                momo 廣告行銷曝光強度支援
              </label>
              <span className="text-sm font-black text-[#ec008c] italic">
                {promoMultiplier}x 曝光強度
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.1"
              value={promoMultiplier}
              onChange={(e) => setPromoMultiplier(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-none appearance-none cursor-pointer accent-[#ec008c]"
            />
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 mt-1">
              <span>1.0x (一般)</span>
              <span>2.0x (限時特談)</span>
              <span>3.0x (超級大牌)</span>
            </div>
          </div>

          {/* Seasonal Index */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                電商節慶與流速季節效應
              </label>
              <span className="text-sm font-black text-[#ec008c]">
                {seasonalEffect > 0 ? `+${Math.round(seasonalEffect * 100)}%` : `${Math.round(seasonalEffect * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.05"
              value={seasonalEffect}
              onChange={(e) => setSeasonalEffect(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-none appearance-none cursor-pointer accent-[#ec008c]"
            />
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 mt-1">
              <span>-50% (淡季)</span>
              <span>0% (基準)</span>
              <span>+50% (雙11慶典)</span>
            </div>
          </div>
        </div>

        <button
          onClick={fetchPrediction}
          disabled={loading}
          className="w-full py-3 bg-[#ec008c] hover:bg-slate-900 disabled:bg-slate-300 text-white font-extrabold uppercase tracking-widest text-xs transition-all border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] rounded-none hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>重新執行 AI 演算</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Charts & Strategic Outputs */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* KPI Panel - Distinct bold boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 border-2 border-slate-900 rounded-none flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            <div className="p-2.5 bg-pink-50 border border-slate-900 text-[#ec008c]">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">推薦優化價格</p>
              <h4 className="text-lg font-black text-slate-900 font-display">
                {prediction ? `NT$ ${prediction.optimizedPrice.toLocaleString()}` : "運算中..."}
              </h4>
            </div>
          </div>

          <div className="bg-white p-4 border-2 border-slate-900 rounded-none flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            <div className="p-2.5 bg-slate-50 border border-slate-900 text-slate-800">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">價格彈性指數 (ELASTICITY)</p>
              <h4 className="text-lg font-black text-[#ec008c] font-display">
                {prediction ? prediction.demandElasticity : "運算中..."}
              </h4>
            </div>
          </div>

          <div className="bg-[#ec008c] text-white p-4 border-2 border-slate-900 rounded-none flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            <div className="p-2.5 bg-white text-[#ec008c] border border-slate-900">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-pink-100 tracking-wider">南港自建庫存決策</p>
              <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold border border-white bg-white/20 text-white">
                {prediction ? `倉儲：${prediction.inventoryAlertLevel}` : "安全評估中"}
              </span>
            </div>
          </div>
        </div>

        {/* Sales Forecast Graph */}
        <div className="bg-white p-6 border-2 border-slate-900 rounded-none shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wide">
                四週銷量模擬預估 / TREND PROJECTION
                {isMock && (
                  <span className="text-[9px] bg-slate-100 border border-slate-900 text-slate-800 px-2 py-0.5 font-bold uppercase tracking-wider">
                    SIMULATOR
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-slate-400">基於 momo 智能推薦與轉化指標之動態定價曲線</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#ec008c] bg-pink-50 border border-pink-200 px-2.5 py-1">
              AI CONFIDENCE: {prediction ? `${prediction.confidenceInterval.min}% - ${prediction.confidenceInterval.max}%` : "95%"}
            </span>
          </div>

          <div className="h-64 w-full">
            {prediction ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="week" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "0px", border: "2px solid #0f172a", fontSize: "12px", fontWeight: "bold" }}
                    cursor={{ fill: '#FFF1F8' }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px', fontWeight: 'bold' }} />
                  <Bar dataKey="預估銷量 (千件)" fill="#ec008c" stroke="#0f172a" strokeWidth={1} barSize={32} />
                  <Bar dataKey="同期對比基售 (千件)" fill="#e2e8f0" stroke="#0f172a" strokeWidth={1} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-400">
                LOADING CORRELATION MATRICES...
              </div>
            )}
          </div>
        </div>

        {/* Elasticity Analysis Output */}
        <div className="p-5 bg-slate-900 text-white border-2 border-slate-900 rounded-none relative overflow-hidden shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#ec008c] opacity-10 rounded-full"></div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-none bg-[#ec008c] animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-[#ec008c]">MOMO STRATEGY DECISION ENGINE / 策略大腦決策：</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-bold italic">
            {prediction ? prediction.elasticityAnalysis : "分析演算法生成中..."}
          </p>
          <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800 pt-3 mt-3 font-mono">
            <span>ADAPTIVE DECISION MATRIX v2.1</span>
            <span className="text-[#ec008c]">FAST_DISTRIBUTION_LINK_OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
