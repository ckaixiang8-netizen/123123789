import React, { useState } from "react";
import { 
  Sliders, ArrowRight, Settings, CheckCircle2, RotateCcw, AlertOctagon, HelpCircle, 
  BarChart4, Briefcase, Target, Layers, PlayCircle, Eye, RefreshCw
} from "lucide-react";
import { SystemDesignResult } from "../types";

const ROLES = [
  { id: "r1", label: "品牌行銷經理 (Brand Marketing PM)", value: "品牌行銷經理" },
  { id: "r2", label: "供應鏈倉儲物流官 (Logistics Dispatcher)", value: "供應鏈倉儲官" },
  { id: "r3", label: "集團戰略長 (Fubon Group VP)", value: "集團戰略長" }
];

const GOALS = [
  { id: "g1", label: "清除老舊倉儲呆料 (Purge Warehouse Excess)", value: "雙11自建倉快速周轉率提昇" },
  { id: "g2", label: "極大化高單價新品利潤 (Maximize Brand Margins)", value: "優化商品客單利潤與momo幣提撥權衡" },
  { id: "g3", label: "提升客戶年度回購率 (Boost Customer LTV)", value: "提升忠實會員回購次數與訂閱制轉化率" }
];

const TASKS = [
  { id: "t1", label: "在 7 天內狂降庫存 35%", value: "執行快閃特惠檔期，配置全自動智慧廣告曝光" },
  { id: "t2", label: "動態調整保養品價格尋求最大毛利", value: "依南區及北區物流空餘指數進行自動動態定價" },
  { id: "t3", label: "設計 momo 專屬福袋與跨品類加價購", value: "自動推荐高關聯組合商品並附贈2%-5%紅利金" }
];

export default function SystemDesignSection() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0].value);
  const [selectedGoal, setSelectedGoal] = useState(GOALS[0].value);
  const [selectedTask, setSelectedTask] = useState(TASKS[0].value);
  
  // Modifiable input parameters that flow into IPO
  const [discountVal, setDiscountVal] = useState(0.85);
  const [bonusPoints, setBonusPoints] = useState(150);
  
  const [loading, setLoading] = useState(false);
  const [designResult, setDesignResult] = useState<SystemDesignResult | null>({
    diagnostics: "經理設定的「目標是雙11自建倉庫存周轉率提高、搭配快速特惠檔期」。系統深度檢驗發現折舊比不符預期，物流成本高，故需導入雙重流程再優化方案。",
    optimizedWorkflow: [
      { step: "步驟 1：角色初始化與指標載入", desc: "確立品牌經理目標，由系統定時擷取 momo 日均 24H 到貨庫存數據庫。" },
      { step: "步驟 2：首輪流程優化 (定價調度)", desc: "根據折扣率 0.85，演算對周轉產生的正向提升，自動設定折價券。整合 momo 全自動廣告投放排程。" },
      { step: "步驟 3：再度流程優化 (回饋再補償)", desc: "納入即時轉化率。若發現轉換率落後, 即時觸發補償機制：加碼贈送 150 momo幣，提高購物車結帳意願。" },
      { step: "步驟 4：最終物流履約升級", desc: "啟動南部物流自動智能跨倉調撥，保障快速配送體驗並減少爆倉風險，提升次日超達比率。" }
    ],
    correctionLoop: {
      metricsToMonitor: ["購物車放棄率 (%)", "momo 幣促銷轉化率", "跨倉南部物流平均等待天數"],
      failureTriggers: "當點擊轉化率低於 2.4%，或日均銷量低於預估下限，自動調降客單門檻 50 元，並追加 momo 首頁熱點版位曝光度。",
      feedbackAdjustments: "即時修改目標回饋：將銷售回報數據定時打包成 json 再次輸入 A 預測引擎，在 3 分鐘內動態調配供應鏈補貨。"
    }
  });

  const runOptimization = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/system-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          goal: selectedGoal,
          task: selectedTask,
          variables: {
            discount: discountVal,
            bonusPoints: bonusPoints
          }
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setDesignResult(resData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-optimization trigger (results modification loop feedback back to parameters)
  const applyCorrectionFeedbackToInputs = () => {
    // Simulates dynamic reinforcement feedback. Adjust variables based on the correction plan.
    setDiscountVal(0.75); // make discount deeper for correction
    setBonusPoints(250);  // double bonus points
    alert("🔄 糾偏機制已啟動！系統自動調優：已將折扣調深至 75 折（0.75）、紅利金加碼調升至 250 元 momo幣，並重新跑系統回饋鏈！");
  };

  return (
    <div id="system-design-section" className="flex flex-col gap-6">
      
      {/* Dynamic Interactive Pipeline Explanation */}
      <div className="bg-slate-55 p-5 rounded-2xl border border-gray-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#fbfbfc]">
        <div>
          <h4 className="text-gray-800 font-bold text-sm">系統設計模型：I-P-O 及 雙循環糾偏優化架構 (System Design Architecture)</h4>
          <p className="text-xs text-gray-500 mt-1">
            本模組完美實踐輸入、流程（雙重優化）、輸出與結果纠偏反饋的閉環設計。
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <span className="text-[10px] uppercase font-bold px-2 py-1 bg-pink-100 text-[#e1007f] rounded">Input-Process-Output</span>
          <span className="text-[10px] uppercase font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded">Feedback Correction Loop</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* INPUT: Role, Goals & Parameters */}
        <div className="lg:col-span-4 flex flex-col gap-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          
          <div className="flex items-center gap-2 border-b border-gray-55 pb-3">
            <span className="w-5 h-5 bg-pink-50 text-[#e1007f] rounded flex items-center justify-center font-bold text-xs ring-4 ring-pink-50">I</span>
            <div>
              <h3 className="font-bold text-sm text-gray-800">輸入階段 (Input Matrix)</h3>
              <p className="text-[10px] text-gray-400">角色、目標與限制任務</p>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              1. 決策角色設定 (Role)
            </label>
            <div className="flex flex-col gap-1.5">
              {ROLES.map(role => (
                <label 
                  key={role.id} 
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedRole === role.value 
                      ? "border-[#e1007f] bg-pink-50/20 text-[#e1007f] font-semibold" 
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="designer-role" 
                    checked={selectedRole === role.value} 
                    onChange={() => setSelectedRole(role.value)}
                    className="sr-only"
                  />
                  <span>{role.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              2. 核心戰略目標 (Goal)
            </label>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#e1007f] text-gray-700 transition-colors"
            >
              {GOALS.map(goal => (
                <option key={goal.id} value={goal.value}>{goal.label}</option>
              ))}
            </select>
          </div>

          {/* Task */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              3. 排定執行任務 (Task)
            </label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-5 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#e1007f] text-gray-700 transition-colors"
            >
              {TASKS.map(task => (
                <option key={task.id} value={task.value}>{task.label}</option>
              ))}
            </select>
          </div>

          {/* Modifiable Variables */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
              控制參數
            </span>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>設定折扣率</span>
                <span className="font-bold text-[#e1007f]">{discountVal * 10} 折</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={discountVal}
                onChange={(e) => setDiscountVal(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#e1007f]"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>momo幣/紅利回饋</span>
                <span className="font-bold text-[#e1007f]">{bonusPoints} 元 / 筆</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={bonusPoints}
                onChange={(e) => setBonusPoints(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#e1007f]"
              />
            </div>
          </div>

          <button
            onClick={runOptimization}
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-300 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <PlayCircle className="w-4 h-4 text-emerald-400" />
                <span>執行 IPO 系統流程最佳化</span>
              </>
            )}
          </button>
        </div>

        {/* PROCESS: Optimization on Optimization */}
        <div className="lg:col-span-5 flex flex-col gap-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          
          <div className="flex items-center gap-2 border-b border-gray-55 pb-3">
            <span className="w-5 h-5 bg-pink-50 text-[#e1007f] rounded flex items-center justify-center font-bold text-xs ring-4 ring-pink-50">P</span>
            <div>
              <h3 className="font-bold text-sm text-gray-800">流程：雙循環優化 (Process Re-optimization)</h3>
              <p className="text-[10px] text-gray-400">自動化 → 智慧分析 → 二度優化執行</p>
            </div>
          </div>

          {designResult ? (
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-50 text-xs leading-relaxed text-gray-600">
                <span className="font-bold text-[#e1007f] block">🎯 分析背景診斷評估：</span>
                <p className="mt-1 font-light">{designResult.diagnostics}</p>
              </div>

              {/* Step-by-step optimization flow diagram */}
              <div className="flex flex-col gap-3 relative">
                <div className="absolute left-[13px] top-[14px] bottom-[14px] w-[2px] bg-slate-100 -z-5"></div>
                
                {designResult.optimizedWorkflow.map((flow, index) => (
                  <div key={index} className="flex gap-3 items-start relative z-10">
                    <div className="w-7 h-7 bg-[#e1007f] text-white text-xs font-black rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="bg-slate-50 border border-gray-100 rounded-lg p-2.5 flex-1 select-none hover:border-pink-200 transition-all">
                      <span className="text-[11px] font-extrabold text-gray-800 block">
                        {flow.step}
                      </span>
                      <p className="text-[10px] text-gray-500 mt-1 font-light leading-relaxed">
                        {flow.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-gray-400">
              等待優化演算法流程載入中...
            </div>
          )}
        </div>

        {/* OUTPUT & CORRECTION FEEDBACK LOOP */}
        <div className="lg:col-span-3 flex flex-col gap-5 bg-slate-900 p-6 rounded-2xl text-white shadow-sm justify-between">
          
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <span className="w-5 h-5 bg-[#e1007f] text-white rounded flex items-center justify-center font-bold text-xs ring-4 ring-pink-500/20">O</span>
              <div>
                <h3 className="font-bold text-sm text-white">輸出端與糾偏圈 (Output & Feedback)</h3>
                <p className="text-[10px] text-gray-400">結果修正反饋修復環</p>
              </div>
            </div>

            {designResult ? (
              <div className="flex flex-col gap-4">
                {/* Metrics */}
                <div>
                  <span className="text-[11px] text-[#e1007f] font-bold block mb-1.5 uppercase">
                    ◎ 實時監測指標 (Metrics To Monitor)：
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {designResult.correctionLoop.metricsToMonitor.map((metric, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 text-slate-200 font-light px-2 py-0.5 rounded border border-slate-700/60 block">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Failure triggers */}
                <div>
                  <span className="text-[11px] text-[#e1007f] font-bold block mb-1 flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5 text-orange-400" />
                    觸發容錯及糾偏警戒值 (Failure Triggers)：
                  </span>
                  <p className="text-[11px] text-slate-300 font-light leading-relaxed bg-slate-850 p-2 rounded border border-slate-800">
                    {designResult.correctionLoop.failureTriggers}
                  </p>
                </div>

                {/* Correction action */}
                <div>
                  <span className="text-[11px] text-emerald-400 font-bold block mb-1">
                    ♻️ 反饋修正與輸入調校重啟：
                  </span>
                  <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                    {designResult.correctionLoop.feedbackAdjustments}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-550 text-center py-10">資料運算中</div>
            )}
          </div>

          {/* Test Correcting feedback action button */}
          <button
            onClick={applyCorrectionFeedbackToInputs}
            className="w-full mt-4 py-2 bg-gradient-to-r from-pink-600 to-[#e1007f] hover:from-pink-700 hover:to-[#c2006d] text-white rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>觸發糾偏：將數據反饋回 Input</span>
          </button>
        </div>

      </div>
    </div>
  );
}
