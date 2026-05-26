import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, HelpCircle, Gift, AlertTriangle, Sparkles, RefreshCw, Layers } from "lucide-react";
import { Message, AgentResponse, RecommendItem } from "../types";

export default function InteractiveAgent() {
  const [userRole, setUserRole] = useState<"consumer" | "merchant">("consumer");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-init",
      sender: "ai",
      content: `哈囉！我是您的 momo 智慧助理【momo 小蜜糖】。🍬\n\n目前北中南物流中心全自動倉儲穩定連結。請問您今天是以「消費者」身分來搜尋超殺好康，還是以「品牌合作商家」身分來模擬倉儲補貨、動態調價呢？`,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      recommends: [
        { name: "【理膚寶水】B5彈潤修復精華 獨家套組", price: 1680, pointsGift: 150 },
        { name: "3C降噪藍牙耳機【破盤特價】", price: 4290, pointsGift: 400 }
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [liveAlert, setLiveAlert] = useState("⚡️ 實時廣播：全台黑貓與大榮货運配送網絡，北北基桃 3 小時到貨率今日已達 99.4%！");

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle switching perspective roles
  const handleRoleChange = (role: "consumer" | "merchant") => {
    setUserRole(role);
    const welcomeMsg = role === "consumer"
      ? "已切換為【消費者智慧導購顧問】！您可以詢問：「我想用momo幣折抵買保養品」、「今天有什麼限時神券」或「快速到貨配送狀態」。"
      : "已切換為【商家供應鏈與行銷顾问】！身為電商優化大腦，我可以幫您預測：「南部倉位吃緊該如何調度」、「保養品如果折扣打8折對銷量的衝擊」或「優化廣告轉換率排程」。";
    
    setMessages(prev => [
      ...prev,
      {
        id: `role-chg-${Date.now()}`,
        sender: "ai",
        content: welcomeMsg,
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgText = inputText;
    setInputText("");

    // 1. Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.sender === "user" ? "user" : "model",
        content: m.content
      }));

      const response = await fetch("/api/smart-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          userRole: userRole
        })
      });

      const resData = await response.json();
      if (resData.success) {
        const agentResponse: AgentResponse = resData.data;
        
        // 2. Add AI message with suggestions
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          content: agentResponse.reply,
          timestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          recommends: agentResponse.recommends
        };

        setMessages(prev => [...prev, aiMsg]);
        if (agentResponse.realtimeAlert) {
          setLiveAlert(agentResponse.realtimeAlert);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const templates = userRole === "consumer" 
    ? [
        "推薦最熱門的保健食品",
        "我想用 momo 幣折抵買美妝",
        "今天南部配送會延遲嗎？"
      ]
    : [
        "南部自建物流倉儲庫存偏低如何處置？",
        "分析美妝保養打85折後的銷售轉化彈性",
        "模擬紅利金加碼 200 對點擊率的幫助"
      ];

  return (
    <div id="interactive-agent-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
      {/* Interactive Helper Left Sidebar */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-pink-50 rounded-lg text-[#e1007f]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">智慧雙向互動顧問</h3>
          </div>
          
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            採用 momo 即時客服語意鏈結引擎，支持「消費者導購」與「品牌商家行銷」雙重情境切换。體現互動化與即時反應。
          </p>

          {/* Role selection tab button */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">
              切換諮詢視角 Perspective
            </label>
            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => handleRoleChange("consumer")}
                className={`text-xs py-2 px-1 rounded-lg font-medium transition-all cursor-pointer text-center ${
                  userRole === "consumer"
                    ? "bg-white text-[#e1007f] shadow-xs font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                消費者 (導購比價)
              </button>
              <button
                onClick={() => handleRoleChange("merchant")}
                className={`text-xs py-2 px-1 rounded-lg font-medium transition-all cursor-pointer text-center ${
                  userRole === "merchant"
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                品牌商家 (營運排程)
              </button>
            </div>
          </div>

          {/* Quick Query Templates */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-gray-700 block mb-2.5">
              情境推薦提問 (點擊發送)：
            </span>
            <div className="flex flex-col gap-2">
              {templates.map((tmpl, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputText(tmpl);
                  }}
                  className="text-left text-xs bg-gray-50 hover:bg-pink-50 hover:text-[#e1007f] border border-gray-100 rounded-lg p-2.5 text-gray-600 transition-colors cursor-pointer"
                >
                  {tmpl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time alerting news sticker */}
        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl mt-4 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-orange-700 block uppercase">
              即時物流及促銷回饋警報
            </span>
            <p className="text-xs text-orange-800 mt-1 font-light leading-snug">
              {liveAlert}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Windows Container - Right Panel */}
      <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden h-[540px]">
        {/* Chat box header */}
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e1007f] flex items-center justify-center font-extrabold text-xs">
              m
            </div>
            <div>
              <h4 className="text-sm font-bold flex items-center gap-1">
                momo 小蜜糖 AI 顧問
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
              </h4>
              <p className="text-[10px] text-gray-400 font-mono">
                當前角色: {userRole === "consumer" ? "消費者智慧行銷助理" : "商家供應鏈深度決策引擎"}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-gray-400 bg-slate-800 px-2 py-1 rounded-sm">
            即時反饋鏈：對話完備
          </span>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.sender === "user" ? "bg-slate-800 text-white" : "bg-pink-100 text-[#e1007f]"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="flex flex-col gap-1.5">
                <div
                  className={`p-3.5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-slate-800 text-white rounded-tr-xs"
                      : "bg-white text-gray-800 border border-gray-150 rounded-tl-xs shadow-3xs"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Optional smart recommendation product list inside balloon */}
                {msg.recommends && msg.recommends.length > 0 && (
                  <div className="flex flex-col gap-2 bg-pink-50/50 border border-pink-100 p-3 rounded-lg mt-1.5">
                    <span className="text-[10px] font-semibold text-[#e1007f] flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      智慧關聯好禮 / 促銷方案推薦
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {msg.recommends.map((item, idx) => (
                        <div key={idx} className="bg-white p-2 rounded-md border border-pink-50 flex flex-col justify-between">
                          <span className="text-[11px] font-bold text-gray-700 truncate block">
                            {item.name}
                          </span>
                          <div className="flex justify-between items-center mt-1.5">
                            <span className="text-xs text-[#e1007f] font-black">
                              NT$ {item.price.toLocaleString()}
                            </span>
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-xs font-semibold">
                              送 {item.pointsGift} momo幣
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-gray-400 self-end px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-lg bg-pink-100 text-[#e1007f] flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-151 text-xs text-gray-400 shadow-3xs">
                momo 小蜜糖正在讀取即時大數據與庫存伺服器...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat input form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder={
              userRole === "consumer"
                ? "詢問有關 momo 幣回饋、折價券、24H配送..."
                : "輸入商家痛點：南部物流配置、促銷對銷量預測的影響..."
            }
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-[#e1007f] text-gray-700 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="bg-[#e1007f] hover:bg-[#c2006d] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">發送</span>
          </button>
        </form>
      </div>
    </div>
  );
}
