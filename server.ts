import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiInstance: GoogleGenAI | null = null;
function getGemini() {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiInstance;
}

// Check api key status
app.get("/api/key-status", (req, res) => {
  const isConfigured = !!getGemini();
  res.json({ configured: isConfigured });
});

// Mock database for default demonstration fallbacks
const mockEcomTrends = {
  categories: [
    { id: "3c", name: "美妝保養 (Cosmetics)", currentVolume: 125000, growthRate: 15.4, stockCount: 4200 },
    { id: "3a", name: "日用百貨 (Groceries)", currentVolume: 284000, growthRate: 8.2, stockCount: 15300 },
    { id: "3e", name: "流行服飾 (Fashion)", currentVolume: 94000, growthRate: -2.3, stockCount: 8900 },
    { id: "3d", name: "3C旗艦 (Electronics)", currentVolume: 310000, growthRate: 12.8, stockCount: 3100 },
    { id: "3h", name: "保健食品 (Health & Supplement)", currentVolume: 185000, growthRate: 22.1, stockCount: 6200 }
  ],
  campaigns: [
    { id: "c1", name: "momo狂歡電商節 (momo Carnival)", discountRatio: 0.82, clickRate: 4.8 },
    { id: "c2", name: "週末限時下殺 (Weekend Special)", discountRatio: 0.75, clickRate: 6.2 },
    { id: "c3", name: "紅利金回饋爆發 (Bonus Points Bonanza)", discountRatio: 0.90, clickRate: 3.5 }
  ]
};

// Route 1: Prediciton (預測) & Dynamic Pricing Calculator
app.post("/api/predict", async (req, res) => {
  const { category, currentPrice, promoMultiplier, seasonalEffect } = req.body;
  const gemini = getGemini();

  const selectedCat = mockEcomTrends.categories.find(c => c.name.includes(category) || category.includes(c.name)) 
    || mockEcomTrends.categories[0];

  const fallbackData = {
    predictedSales: Array.from({ length: 4 }, (_, i) => {
      const baseVal = selectedCat.currentVolume / 1000 * (1 + (selectedCat.growthRate / 100));
      const mult = (1 + (promoMultiplier - 1) * 0.4) * (1 + seasonalEffect * 0.15);
      const priceEffect = 1 + (currentPrice < 1000 ? 0.05 : -0.06);
      return Math.round(baseVal * mult * priceEffect * (1 + (i * 0.03)));
    }),
    confidenceInterval: { min: 82, max: 96 },
    optimizedPrice: Math.round(currentPrice * (seasonalEffect > 0 ? 1.08 : 0.92)),
    inventoryAlertLevel: "NORMAL",
    demandElasticity: -1.45,
    elasticityAnalysis: "此類商品對於價格波動較為敏感。在此推廣倍率與季節效應下，適度降價 5% 可帶動超過 8% 的貨量增長。建議搭配 momo 折價券進行定向促銷。"
  };

  if (!gemini) {
    return res.json({
      success: true,
      data: fallbackData,
      isMock: true
    });
  }

  try {
    const prompt = `你是一個電商物流與零售大腦分析師（momo購物網視角）。
請評估選定品類: "${selectedCat.name}"，當前價格: NT$${currentPrice}，促銷強度: ${promoMultiplier}x，季節性效應指數: ${seasonalEffect}。
請預測未來4個星期的销售量，並給出動態定價優化建議與需求彈性分析。
請輸出格式必須為 JSON，包含以下欄位：
1. predictedSales (長度為 4 的數字陣列，代表未來 1 至 4 週預估每週銷量千位數，如 [120, 134, 140, 138])
2. confidenceInterval (包含 min 和 max 的物件，代表信賴區間 %)
3. optimizedPrice (推薦的優化定價數字)
4. inventoryAlertLevel (字串: "SAFE", "NORMAL", "WARNING", "CRITICAL")
5. demandElasticity (價格彈性系數，通常為負值小數，如 -1.4)
6. elasticityAnalysis (200字內的繁體中文分析與建議，切入 momo 自建倉儲物流如南部物流中心、快速到貨與供應商備貨角度)`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedSales: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER }
            },
            confidenceInterval: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.INTEGER },
                max: { type: Type.INTEGER }
              },
              required: ["min", "max"]
            },
            optimizedPrice: { type: Type.INTEGER },
            inventoryAlertLevel: { type: Type.STRING },
            demandElasticity: { type: Type.NUMBER },
            elasticityAnalysis: { type: Type.STRING }
          },
          required: ["predictedSales", "confidenceInterval", "optimizedPrice", "inventoryAlertLevel", "demandElasticity", "elasticityAnalysis"]
        }
      }
    });

    const resultText = response.text || "";
    const parsed = JSON.parse(resultText.trim());
    res.json({
      success: true,
      data: parsed,
      isMock: false
    });
  } catch (err: any) {
    console.error("Predict error:", err);
    res.json({
      success: true,
      data: fallbackData,
      isMock: true,
      error: err.message
    });
  }
});

// Route 2: AI Automation Copywriting & Smart Promotion Auto-Generator
app.post("/api/generate-copy", async (req, res) => {
  const { productName, category, highlights, keywordTarget } = req.body;
  const gemini = getGemini();

  const fallbackCopy = {
    momoTitle: `【momo獨家】經典熱銷款 ${productName || "智慧美妝保養組"} - ${highlights || "超值特惠"}`,
    marketingBullets: [
      "🔥 momo 獨家限時特談：下殺破盤，回饋超有感！",
      "📦 享 momo 24H 快速到貨：今日下單，明日送到家！",
      "💎 百萬美妝部落客聯名推薦，擊退暗沉深層保濕",
      "🎁 限時滿額再送極效體驗瓶，買一送四神級超值額外組"
    ],
    adBannerIdea: `主標題：【momo 爆品節】狂降5折起！\n副標題：經典熱銷 ${productName || "爆款"} 全台免運24小時速達，搶購賺紅利金！`,
    automationProcessLog: "1. 偵測主關鍵字 → 2. 比對 momo 搜尋趨勢庫 → 3. 嵌入24H快速到貨文案規則 → 4. 生成 momo 特色促銷框"
  };

  if (!gemini) {
    return res.json({
      success: true,
      data: fallbackCopy,
      isMock: true
    });
  }

  try {
    const prompt = `你是一個 momo 購物網的資深電商行銷寫手。口吻應熱情、誇張、高轉化率，善用「momo獨家」、「破盤下殺」、「限時狂降」、「24h速達」、「紅利金回饋」等 momo 經典行銷話術。
請為以下商品生成電商文案：
品名：${productName}
分類：${category}
特色亮點：${highlights}
目標關鍵字：${keywordTarget}

請輸出格式為 JSON，包含：
1. momoTitle (符合momo規範的搶眼商品標題，含中括號促銷標籤)
2. marketingBullets (4個行銷賣點切入陣列，其中至少一個要提及 momo 24H 快速到貨、超商取貨或紅利金驚喜)
3. adBannerIdea (大圖視覺文案及slogan)
4. automationProcessLog (系統自動化步驟紀錄，說明 AI 如何從原料生成高點擊率文案)`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            momoTitle: { type: Type.STRING },
            marketingBullets: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            adBannerIdea: { type: Type.STRING },
            automationProcessLog: { type: Type.STRING }
          },
          required: ["momoTitle", "marketingBullets", "adBannerIdea", "automationProcessLog"]
        }
      }
    });

    const parsed = JSON.parse((response.text || "").trim());
    res.json({
      success: true,
      data: parsed,
      isMock: false
    });
  } catch (err: any) {
    console.error("Copywriting error:", err);
    res.json({
      success: true,
      data: fallbackCopy,
      isMock: true,
      error: err.message
    });
  }
});

// Route 3: Smart Agent - Interactive Customer & Consultant Chat (互動化 & 即時化)
app.post("/api/smart-agent", async (req, res) => {
  const { messages, userRole } = req.body; // userRole: "consumer" | "merchant"
  const gemini = getGemini();

  const lastMsg = messages[messages.length - 1]?.content || "請推薦美妝爆品";

  const fallbackInteraction = {
    reply: `感謝您諮詢 momo 智慧助理。全天候 24H 快速到貨已為您就緒！目前 "${lastMsg}" 有促銷專案，現拆 momo 專屬折價券更划算。請問您想了解：1. 配送進度 2. 紅利金折抵 3. 退換貨規範？`,
    recommends: [
      { name: "雅詩蘭黛特潤超導修護露 (momo特談組)", price: 2980, pointsGift: 300 },
      { name: "【理膚寶水】B5彈潤修復精華 獨家套組", price: 1680, pointsGift: 150 }
    ],
    realtimeAlert: "⚠️ 提醒：目前南物流中心該商品庫存低於預期警戒線，建議加開北部跨倉支援。"
  };

  if (!gemini) {
    return res.json({
      success: true,
      data: fallbackInteraction,
      isMock: true
    });
  }

  try {
    const prompt = `你現在是 momo 電商智慧互動顧問，名稱為「momo 小蜜糖」。
你的角色是 ${userRole === "merchant" ? "商家供應鏈與行銷排程顧問 (幫助合作商家優化定價與物流)" : "消費者智慧導購顧問 (幫消費者找好康、比價、用紅利金)"}。
請根據對話紀錄，回覆使用者的最新一句詢問："${lastMsg}"。
你要展現即時化、智慧化。

請輸出格式為 JSON：
1. reply (繁體中文回覆內容，口吻活潑熱情，句尾常帶有 momo 式關懷)
2. recommends (推薦的2項熱門關聯商品，格式為陣列，包含 name, price, pointsGift 欄位)
3. realtimeAlert (即時物流或特惠警示，例如「⚡️全台僅剩 12 組，北北基桃 3 小時到貨率已達 99.2%」)`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            recommends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.INTEGER },
                  pointsGift: { type: Type.INTEGER }
                },
                required: ["name", "price", "pointsGift"]
              }
            },
            realtimeAlert: { type: Type.STRING }
          },
          required: ["reply", "recommends", "realtimeAlert"]
        }
      }
    });

    const parsed = JSON.parse((response.text || "").trim());
    res.json({
      success: true,
      data: parsed,
      isMock: false
    });
  } catch (err: any) {
    console.error("Smart Agent error:", err);
    res.json({
      success: true,
      data: fallbackInteraction,
      isMock: true,
      error: err.message
    });
  }
});

// Route 4: System Design Optimization Engine (系統設計之 I-P-O 及 反饋優化迭代)
app.post("/api/system-design", async (req, res) => {
  const { role, goal, task, variables } = req.body;
  const gemini = getGemini();

  const fallbackOptimization = {
    diagnostics: "分析當前變數：此品類客單價偏高，當前檔期點擊率良好但庫存周轉偏慢，可能是 momo 物流跨倉調撥時間未優化，或折價券門檻不符目標客戶群。",
    optimizedWorkflow: [
      { step: "1. 角色初始化", desc: `設定虛擬 ${role || "商品經理"}，目標鎖定 "${goal || "提高庫存周轉率"}"。` },
      { step: "2. 首輪流程優化", desc: `針對任務「${task || "降價排檔"}」，自動配置動態折價下殺 (折率 ${variables.discount || 0.85})，同步建立 momo 全自動廣告投放排程。` },
      { step: "3. 再度優化對比", desc: `導入即時銷售回饋，比對實際銷量與預測。若發現轉換率落後, 即時觸發補償機制：增加贈送 ${variables.bonusPoints || 100} momo幣（紅利金）。` },
      { step: "4. 整體再升級", desc: "主動啟動全台南部物流智慧調撥，減少預售配送等待期，提升次日達比率至 98.5%。" }
    ],
    correctionLoop: {
      metricsToMonitor: ["購物車放棄率 (%)", "momo 幣折抵轉化率", "跨倉物流履約成本"],
      failureTriggers: "若點擊轉化率低於 2.4%，或日均銷量低於預測下限，系統將自動調降客單門檻 50 元，並追加 momo 首頁熱點版位曝光度。",
      feedbackAdjustments: "即時修改目標回饋：將銷售回報數據定時打包成 json 再次輸入 A 預測引擎，在 3 分鐘內動態調配供應鏈補貨。"
    }
  };

  if (!gemini) {
    return res.json({
      success: true,
      data: fallbackOptimization,
      isMock: true
    });
  }

  try {
    const prompt = `你是一個電商核心決策邏輯器（Momo Shopping System Engine）。
請基於以下系統設計 I-P-O 理論進行「流程再優化」計算：

[輸入 (Input) - 角色目標與任務]
- 決策角色: ${role}
- 策略目標: ${goal}
- 核心任務: ${task}
- 調控變數: 折扣率(${variables.discount})、配送支持及額外加碼momo幣或紅利金(${variables.bonusPoints})

[優化在優化流程 (Process Optimization & Re-optimization)]
- 請針對此特定任務設計一個高效率的自動化執行迴圈。
- 納入「自動監控 -> 點擊轉換分析 -> 智慧修復 -> 再次精準優化」的雙重循環機制。

[輸出與反饋 (Output & Correction Feedback Loop)]
- 說明如何監控結果。
- 設計指標偏離時的「修改、糾偏與反饋(Correction Feedback Loop)」自我修正系統。

請輸出格式為 JSON：
1. diagnostics (診斷現狀與痛點評估字串)
2. optimizedWorkflow (這是一個 4 個步驟的陣列，每個物件包含 "step" (步驟名稱) 和 "desc" (細節做法))
3. correctionLoop (包含 "metricsToMonitor" (監控指標字串陣列), "failureTriggers" (若失效如何自動糾偏之敘述), "feedbackAdjustments" (結果如何回饋至下一輪 input 的說明物件或字串))`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnostics: { type: Type.STRING },
            optimizedWorkflow: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.STRING },
                  desc: { type: Type.STRING }
                },
                required: ["step", "desc"]
              }
            },
            correctionLoop: {
              type: Type.OBJECT,
              properties: {
                metricsToMonitor: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                failureTriggers: { type: Type.STRING },
                feedbackAdjustments: { type: Type.STRING }
              },
              required: ["metricsToMonitor", "failureTriggers", "feedbackAdjustments"]
            }
          },
          required: ["diagnostics", "optimizedWorkflow", "correctionLoop"]
        }
      }
    });

    const parsed = JSON.parse((response.text || "").trim());
    res.json({
      success: true,
      data: parsed,
      isMock: false
    });
  } catch (err: any) {
    console.error("System Design optimization error:", err);
    res.json({
      success: true,
      data: fallbackOptimization,
      isMock: true,
      error: err.message
    });
  }
});

// Vite server / production routing setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[momo-hub] Server listening at http://localhost:${PORT}`);
  });
}

start();
