import React, { useState, useEffect } from "react";
import { 
  LineChart, Sparkles, ShoppingBag, Terminal, HeartHandshake, Layers, 
  HelpCircle, CheckCircle2, ShieldCheck, Cpu, Database
} from "lucide-react";
import PredictSection from "./components/PredictSection";
import CopywriterSection from "./components/CopywriterSection";
import InteractiveAgent from "./components/InteractiveAgent";
import SystemDesignSection from "./components/SystemDesignSection";

export default function App() {
  const [activeTab, setActiveTab] = useState<"predict" | "auto" | "interactive" | "design">("predict");
  const [keyConfigured, setKeyConfigured] = useState(false);

  useEffect(() => {
    // Check if Gemini API key is configured on the backend
    fetch("/api/key-status")
      .then(res => res.json())
      .then(data => {
        setKeyConfigured(data.configured);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBFD] text-slate-900 antialiased font-sans flex flex-col justify-between">
      
      {/* Top Corporate bar with Artistic Flair design */}
      <header className="bg-white border-b-2 border-slate-900 px-6 sm:px-8 py-5 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          {/* Logo/Branding - Beautiful high-impact typography */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#ec008c] text-white flex items-center justify-center font-black text-2xl uppercase italic select-none border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] rounded-sm">
                m
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-[#ec008c] uppercase italic leading-none font-display">
                  momo AI-SYS
                </h1>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-2.5 tracking-widest uppercase">
              Smart E-Commerce Infrastructure / Core v.4.0.12 — 智慧零售決策系統
            </p>
          </div>

          {/* System status nodes from the specific design style */}
          <div className="flex gap-6 sm:gap-10 text-right w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">System Status</p>
              <p className="text-sm font-mono font-bold text-emerald-500">
                ● OPTIMIZED
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Node</p>
              <p className="text-sm font-mono font-bold italic text-slate-800">
                TAIPEI_DC_01
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gemini Core</p>
              <p className="text-xs font-mono font-bold mt-0.5">
                {keyConfigured ? (
                  <span className="text-[#ec008c]">LIVE_ACTIVE</span>
                ) : (
                  <span className="text-amber-500">MOCK_PREVIEW</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Core Strategy Greeting Block - Styled as Module 00 */}
        <div className="bg-white border-2 border-slate-900 rounded-none p-6 sm:p-8 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          {/* Artistic geometric highlight elements */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#ec008c] opacity-10 rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="flex flex-col gap-2.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  MOMO INTELLIGENCE UNIT
                </span>
                <span className="text-[#ec008c] text-xs font-semibold font-mono">Fubon E-Com Brain v4</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 font-display italic leading-none">
                智慧電子商務零售系統
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                以 momo 購物網的龐大供應鏈、自建自動化倉儲與 24H 快速配送優勢切入。深度整合有：
                <span className="font-bold text-slate-900 underline decoration-[#ec008c] decoration-2">一、大數據智慧銷量預測</span>、
                <span className="font-bold text-slate-900 underline decoration-[#ec008c] decoration-2">二、自動化文案與雙向即時互動</span>，以及
                <span className="font-bold text-slate-900 underline decoration-[#ec008c] decoration-2">三、系統化設計之自適應 I-P-O 糾偏反饋優化流程</span>。
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-900 p-4 shrink-0 w-full md:w-auto shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center gap-3">
                <Cpu className="w-8 h-8 text-[#ec008c] shrink-0 animate-pulse" />
                <div>
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">雙向調價與特談系統</span>
                  <p className="text-xs font-bold text-slate-800">南區智慧自動倉已聯網</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation bar - Distinct, bold block items */}
        <div className="bg-slate-50 p-2 border-2 border-slate-900 flex flex-wrap gap-1.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] rounded-none">
          <button
            onClick={() => setActiveTab("predict")}
            className={`flex-1 min-w-[130px] py-3 px-4 text-xs font-black uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "predict"
                ? "bg-[#ec008c] text-white border border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] italic"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>一、智慧預測與定價</span>
          </button>

          <button
            onClick={() => setActiveTab("auto")}
            className={`flex-1 min-w-[130px] py-3 px-4 text-xs font-black uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "auto"
                ? "bg-[#ec008c] text-white border border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] italic"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>二(1). 零售自動化</span>
          </button>

          <button
            onClick={() => setActiveTab("interactive")}
            className={`flex-1 min-w-[130px] py-3 px-4 text-xs font-black uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "interactive"
                ? "bg-[#ec008c] text-white border border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] italic"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>二(2,3). 互動與即時化</span>
          </button>

          <button
            onClick={() => setActiveTab("design")}
            className={`flex-1 min-w-[130px] py-3 px-4 text-xs font-black uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "design"
                ? "bg-[#ec008c] text-white border border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] italic"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>三、系統設計 I-P-O</span>
          </button>
        </div>

        {/* Dynamic Display Board based on active tab */}
        <div className="transition-all duration-300">
          {activeTab === "predict" && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center gap-3">
                <span className="bg-slate-900 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider">Module 01</span>
                <div>
                  <h2 className="text-3xl font-black italic tracking-tight font-display leading-none">PREDICTION <span className="text-[#ec008c] underline">銷量預測與定價大腦</span></h2>
                  <p className="text-xs text-slate-500 mt-1 font-light">調用巨量電商數據，評估特定品類銷量趨勢，分析價格彈性(Elasticity)與推薦優化策略</p>
                </div>
              </div>
              <PredictSection />
            </div>
          )}

          {activeTab === "auto" && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center gap-3">
                <span className="bg-slate-900 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider">Module 02-A</span>
                <div>
                  <h2 className="text-3xl font-black italic tracking-tight font-display leading-none">AI AUTOMATION <span className="text-[#ec008c] underline">智慧自動化文案</span></h2>
                  <p className="text-xs text-slate-500 mt-1 font-light">整合 24H 快速到貨特色標語、獨家行銷熱詞，一鍵生成即用文案與行銷點擊點</p>
                </div>
              </div>
              <CopywriterSection />
            </div>
          )}

          {activeTab === "interactive" && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center gap-3">
                <span className="bg-slate-900 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider">Module 02-B</span>
                <div>
                  <h2 className="text-3xl font-black italic tracking-tight font-display leading-none">INTERACTION & REAL-TIME <span className="text-[#ec008c] underline">即時雙向客服</span></h2>
                  <p className="text-xs text-slate-500 mt-1 font-light">「momo 小蜜糖」全方位諮詢大腦。支援消費者推薦導購，與商家快速跨倉物流調配分析</p>
                </div>
              </div>
              <InteractiveAgent />
            </div>
          )}

          {activeTab === "design" && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center gap-3">
                <span className="bg-slate-900 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider">Module 03</span>
                <div>
                  <h2 className="text-3xl font-black italic tracking-tight font-display leading-none">SYSTEM DESIGN <span className="text-[#ec008c] underline">系統Ｉ-Ｐ-Ｏ智慧糾偏</span></h2>
                  <p className="text-xs text-slate-500 mt-1 font-light">完整呈現輸入目標、雙重流程优調、輸出監控與反饋糾偏之閉鎖設計</p>
                </div>
              </div>
              <SystemDesignSection />
            </div>
          )}
        </div>

      </main>

      {/* Footer from Artistic Theme */}
      <footer className="bg-slate-900 text-white px-6 sm:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 mt-12 border-t-2 border-slate-950">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-center md:text-left">
          <span className="text-xs font-bold tracking-widest text-slate-400">© 2026 MOMO INTELLIGENCE UNIT</span>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">ISO-27001 COMPLIANT SECURITY INSURED</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#ec008c] font-black">TAIPEI_SERVER_PROCESS_ACTIVE</span>
        </div>
      </footer>

    </div>
  );
}
