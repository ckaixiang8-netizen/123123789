import React, { useState } from "react";
import { Sparkles, FileText, ChevronRight, Copy, Check, Truck, Award, ShieldCheck, ShoppingCart } from "lucide-react";
import { AutomationCopy } from "../types";

export default function CopywriterSection() {
  const [productName, setProductName] = useState("極致保濕複合精華液");
  const [category, setCategory] = useState("美妝保養 (Cosmetics)");
  const [highlights, setHighlights] = useState("24小時長效鎖水、極致親膚玻尿酸、敏感肌適用、清爽不黏膩");
  const [keywordTarget, setKeywordTarget] = useState("保濕精華液 24H快速到貨");
  const [loading, setLoading] = useState(false);
  const [copyData, setCopyData] = useState<AutomationCopy | null>({
    momoTitle: "【momo獨家】經典保濕補水組 - 極致保濕複合精華液 (超值限量回饋)",
    marketingBullets: [
      "🔥 momo 獨家限時特談：下殺破盤58折，回饋超有感！",
      "📦 享 momo 24H 快速到貨：今日下單，明日送到家！",
      "💎 百萬美妝部落客聯名推薦，擊退暗沉深層保濕",
      "🎁 限時滿額再送極效體驗瓶，買一送四神級超值額外組"
    ],
    adBannerIdea: "主標題：【momo 爆品節】狂降5折起！\n副標題：經典熱銷全新配方 全台免運24小時速達，搶購賺紅利金！",
    automationProcessLog: "1. 偵測主關鍵字 → 2. 比對 momo 搜尋趨勢庫 → 3. 嵌入24H快速到貨文案規則 → 4. 生成 momo 特色促銷框"
  });
  const [copied, setCopied] = useState(false);

  const generateCopy = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category,
          highlights,
          keywordTarget
        })
      });
      const data = await response.json();
      if (data.success) {
        setCopyData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="copywriter-section" className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Parameters Panel */}
      <div className="xl:col-span-5 bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-pink-50 rounded-lg text-[#e1007f]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">AI 零售自動化文案生成</h3>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            商家輸入基本商品訊息，系統自動整合 momo 專屬行銷詞、高光標籤與快速物流規則，生成可直上後台的完整文案。
          </p>

          {/* Product Name */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              商品品名
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="例如：極致保濕複合精華液"
              className="w-full px-3 py-2 text-sm bg-gray-5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#e1007f] text-gray-700 transition-colors"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              銷售品類 Group
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#e1007f] text-gray-700 transition-colors"
            >
              <option value="美妝保養 (Cosmetics)">美妝保養 (Cosmetics)</option>
              <option value="保健食品 (Health & Supplement)">保健食品 (Health & Supplement)</option>
              <option value="日用百貨 (Groceries)">日用百貨 (Groceries)</option>
              <option value="流行服飾 (Fashion)">流行服飾 (Fashion)</option>
              <option value="3C旗艦 (Electronics)">3C旗艦 (Electronics)</option>
            </select>
          </div>

          {/* Highlights */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              產品配方/極致亮點 (請以逗號分隔)
            </label>
            <textarea
              rows={3}
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="例如：24小時鎖水, 極致親膚, 敏感肌適用"
              className="w-full px-3 py-2 text-sm bg-gray-5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#e1007f] text-gray-700 transition-colors"
            />
          </div>

          {/* Keyword targets */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              SEO 關鍵字目標 / 活動標籤
            </label>
            <input
              type="text"
              value={keywordTarget}
              onChange={(e) => setKeywordTarget(e.target.value)}
              placeholder="例如：保濕精華液 24H快速到貨"
              className="w-full px-3 py-2 text-sm bg-gray-5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#e1007f] text-gray-700 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={generateCopy}
          disabled={loading}
          className="w-full py-3 bg-[#e1007f] hover:bg-pink-700 disabled:bg-gray-300 text-white font-medium rounded-xl text-sm transition-all shadow-sm shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>AI 自動寫手撰寫中...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>生成 momo 網爆款文案</span>
            </>
          )}
        </button>
      </div>

      {/* visual mockup preview - right panel */}
      <div className="xl:col-span-7 flex flex-col gap-6">
        {/* Mocking Momo eCommerce Platform detail view */}
        <div className="bg-[#FAF6F8] rounded-2xl border border-pink-100 p-6 flex flex-col gap-4 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#e1007f]/10 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="bg-[#e1007f] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs">momo 購物網</span>
              <span className="text-xs text-gray-400 font-medium font-mono">產品頁面預覽 (Responsive Live Preview)</span>
            </div>
            <button
              onClick={() => copyData && handleCopyText(`${copyData.momoTitle}\n\n${copyData.marketingBullets.join("\n")}`)}
              className="text-xs text-[#e1007f] border border-pink-200 hover:bg-[#e1007f] hover:text-white bg-white px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>已複製文案</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>複製一鍵套用</span>
                </>
              )}
            </button>
          </div>

          {copyData ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-5 rounded-xl border border-gray-100 shadow-2xs">
              {/* Left Column: Mock Product Image */}
              <div className="md:col-span-4 flex flex-col gap-3">
                <div className="aspect-square bg-slate-50 border border-gray-100 rounded-lg flex flex-col items-center justify-center p-4 relative">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-[#e1007f] mb-2 font-bold text-center text-xs">
                    momo
                  </div>
                  <span className="text-xs font-bold text-gray-700 text-center px-1 truncate w-full">
                    {productName}
                  </span>
                  <span className="absolute bottom-1.5 left-1.5 bg-[#e1007f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-sm">
                    <Truck className="w-2.5 h-2.5" /> 24H速達
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="aspect-square bg-gray-100 rounded border border-pink-200 flex items-center justify-center text-[9px] text-pink-600">主圖</div>
                  <div className="aspect-square bg-gray-50 rounded flex items-center justify-center text-[9px] text-gray-400">附圖1</div>
                  <div className="aspect-square bg-gray-50 rounded flex items-center justify-center text-[9px] text-gray-400">附圖2</div>
                </div>
              </div>

              {/* Right Column: Title and copywriting bullets */}
              <div className="md:col-span-8 flex flex-col justify-between">
                <div>
                  {/* Momo title */}
                  <h4 className="font-extrabold text-[#e1007f] text-base leading-snug tracking-tight mb-2.5 hover:underline cursor-pointer">
                    {copyData.momoTitle}
                  </h4>

                  {/* Brand Tag, Rating */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="text-[10px] bg-pink-50 text-[#e1007f] border border-pink-100 px-1.5 py-0.5 font-bold rounded">
                      獨家首發
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 font-medium rounded">
                      #1 熱銷推薦
                    </span>
                    <span className="text-xs text-yellow-500 font-bold">★ 4.9 (4211條評價)</span>
                  </div>

                  {/* Pricing line */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-400 line-through mr-2">市價 $3,500</span>
                      <span className="text-xs text-[#e1007f] mr-1">momo 獨家下殺價: </span>
                      <span className="text-xl font-black text-[#e1007f]">$1,980</span>
                    </div>
                    <span className="text-[10px] bg-[#e1007f] text-white font-bold py-0.5 px-2 rounded-full shadow-xs animate-pulse">
                      送 3% momo幣
                    </span>
                  </div>

                  {/* Bullets point list */}
                  <div className="flex flex-col gap-2">
                    {copyData.marketingBullets.map((bullet, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-xs text-gray-600">
                        <ChevronRight className="w-4 h-4 text-[#e1007f] mt-0.5 shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Award className="w-3.5 h-3.5 text-yellow-500" />
                    <span>正品保證</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    <span>7天鑑賞期</span>
                  </div>
                  <button className="ml-auto bg-[#e1007f] hover:bg-pink-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>放入購物車</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-gray-400">
              文案生成中...
            </div>
          )}
        </div>

        {/* Dynamic AD Campaign Generated Slogan */}
        {copyData && (
          <div className="bg-slate-900 rounded-xl p-5 text-white flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#e1007f] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#e1007f] rounded-full"></span>
              momo 爆期首頁大圖 & 橫幅推播 Banner (自動生成廣告)
            </h4>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <pre className="text-sm font-light whitespace-pre-wrap font-sans text-gray-100">
                {copyData.adBannerIdea}
              </pre>
            </div>
            
            {/* System pipeline log */}
            <div>
              <div className="text-[10px] text-gray-500 font-mono flex justify-between uppercase">
                <span>自動化工作流紀錄 (Automation Pipeline Logs)</span>
                <span>模組：CopyGen-v4</span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-1 pt-1.5 border-t border-slate-800 leading-tight">
                {copyData.automationProcessLog}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
