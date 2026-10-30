import React, { useState, useEffect, useRef } from "react";
import { Icon } from "../components/Icon";
import { Button } from "../components/Button";
import { useDemo } from "../context/Demo";
import {
  exportAgencyExcel,
  ExportSheetType,
} from "../utils/excelExport";

interface CopilotMetric {
  label: string;
  value: string;
  subtext?: string;
}

interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  metrics?: CopilotMetric[];
  exportAction?: ExportSheetType | "none";
  followUpSuggestions?: string[];
}

interface CopilotThread {
  id: string;
  title: string;
  updatedAt: string;
  messages: CopilotMessage[];
}

export const S60Copilot: React.FC = () => {
  const {
    back,
    go,
    role,
    plan,
    language,
    user,
    userProfile,
    shipments,
    containers,
    payments,
    clients,
    routes,
    unmatchedItems,
    staffList,
  } = useDemo();

  const storageKey = `logislo_copilot_threads_${userProfile.agencyId || user?.uid || "owner"}`;

  const [threads, setThreads] = useState<CopilotThread[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed: CopilotThread[] = saved ? JSON.parse(saved) : [];
      return parsed[0]?.id || null;
    } catch {
      return null;
    }
  });

  const [historyOpen, setHistoryOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [exportedNotice, setExportedNotice] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecRef = useRef<any>(null);
  const speechInterimRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(threads));
    } catch {
      // Ignore storage quota errors
    }
  }, [threads, storageKey]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || null;
  const messages = activeThread?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  const ownerFirstName =
    (userProfile.name || "Owner").trim().split(" ")[0] || "Owner";

  const copy = {
    en: {
      welcome: `Welcome, ${ownerFirstName}`,
      subtitle: "What would you like to do today?",
      placeholder: "Ask Logislo anything...",
      recentChats: "Recent chats",
      newChat: "New chat",
      noChats: "No recent conversations yet.",
      listening: "Listening (EN / FR / 中文)... Tap mic to finish",
      transcribing: "Transcribing voice...",
      thinking: "Analyzing agency data...",
      downloadExcel: "Download Excel Sheet",
      prompts: [
        "How many sales & containers do we have?",
        "Which products are selling & shipping fastest?",
        "Give me insights on owed balances & top clients",
        "Export an Excel sheet of all shipments & cargo",
      ],
    },
    fr: {
      welcome: `Bienvenue, ${ownerFirstName}`,
      subtitle: "Que souhaitez-vous faire aujourd'hui ?",
      placeholder: "Demandez tout à Logislo...",
      recentChats: "Discussions récentes",
      newChat: "Nouvelle discussion",
      noChats: "Aucune conversation récente.",
      listening: "Écoute en cours (FR / EN / 中文)... Appuyez pour terminer",
      transcribing: "Transcription vocale...",
      thinking: "Analyse des données de l'agence...",
      downloadExcel: "Télécharger le fichier Excel",
      prompts: [
        "Combien de ventes et de conteneurs avons-nous ?",
        "Quels produits s'expédient le plus rapidement ?",
        "Donnez-moi des analyses sur les soldes impayés",
        "Exporter une feuille Excel de toutes les expéditions",
      ],
    },
    zh: {
      welcome: `欢迎, ${ownerFirstName}`,
      subtitle: "您今天想了解什么？",
      placeholder: "向 Logislo 询问任何问题...",
      recentChats: "最近对话",
      newChat: "新对话",
      noChats: "暂无最近对话记录。",
      listening: "正在倾听 (中文 / EN / FR)... 点击麦克风完成",
      transcribing: "正在转换语音...",
      thinking: "正在分析公司数据...",
      downloadExcel: "下载 Excel 表格",
      prompts: [
        "我们目前有多少销售额和集装箱？",
        "哪些产品发货和销售速度最快？",
        "分析未结清欠款和核心客户表现",
        "导出所有货物和采购的 Excel 表格",
      ],
    },
  }[language];

  // Strictly Owner-Only Access
  if (role !== "Owner") {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-4"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "var(--accent-tint)",
            color: "var(--accent)",
          }}
        >
          <Icon name="lock" size={24} color="var(--accent)" />
        </div>
        <h2 className="text-[20px] font-extrabold text-[var(--ink)]">
          Owner Only
        </h2>
        <p className="text-[14px] text-[var(--muted)] max-w-[280px]">
          Logislo Copilot is restricted exclusively to the agency Owner.
        </p>
        <Button variant="primary" onClick={back}>
          Go back
        </Button>
      </div>
    );
  }

  const handleExport = (sheetType: ExportSheetType = "all") => {
    const filename = exportAgencyExcel(
      {
        agencyName: userProfile.agencyName || "Logislo Agency",
        currency: userProfile.currency || "FCFA",
        shipments,
        containers,
        payments,
        clients,
      },
      sheetType
    );
    setExportedNotice(`Downloaded ${filename}`);
    setTimeout(() => setExportedNotice(null), 3500);
  };

  const buildLiveContextSnapshot = () => {
    const totalBilled = shipments.reduce((sum, s) => sum + (s.shippingFee || 0), 0);
    const totalCollected = payments
      .filter((p) => p.amount > 0)
      .reduce((sum, p) => sum + p.amount, 0);
    const totalOwed = shipments.reduce(
      (sum, s) => sum + (s.balance > 0 ? s.balance : 0),
      0
    );
    const totalContainerProfit = containers.reduce(
      (sum, c) => sum + (c.profit || 0),
      0
    );

    // Aggregate product/cargo frequency from shipment descriptions
    const cargoCounts: Record<string, { count: number; boxes: number; weight: number; revenue: number }> = {};
    shipments.forEach((s) => {
      const desc = (s.description || "General cargo").trim();
      if (!cargoCounts[desc]) {
        cargoCounts[desc] = { count: 0, boxes: 0, weight: 0, revenue: 0 };
      }
      cargoCounts[desc].count += 1;
      cargoCounts[desc].boxes += s.boxes || 0;
      cargoCounts[desc].weight += s.weightKg || 0;
      cargoCounts[desc].revenue += s.shippingFee || 0;
    });

    const topProducts = Object.entries(cargoCounts)
      .map(([product, stats]) => ({ product, ...stats }))
      .sort((a, b) => b.revenue - a.revenue || b.count - a.count);

    return {
      agencyName: userProfile.agencyName,
      ownerName: userProfile.name,
      currency: userProfile.currency || "FCFA",
      summaryMetrics: {
        totalShipments: shipments.length,
        totalContainers: containers.length,
        totalClients: clients.length,
        totalStaff: staffList.length,
        unmatchedCargoCount: unmatchedItems.length,
        totalSalesBilled: totalBilled,
        totalCashCollected: totalCollected,
        totalReceivablesOwed: totalOwed,
        netContainerProfit: totalContainerProfit,
      },
      topProductsAndCargoMoved: topProducts,
      shipments: shipments.slice(0, 50).map((s) => ({
        id: s.id,
        clientName: s.clientName,
        clientCode: s.clientCode,
        productDescription: s.description || "General merchandise",
        status: s.status,
        route: s.route,
        boxes: s.boxes,
        weightKg: s.weightKg || 0,
        cbm: s.cbm || 0,
        fee: s.shippingFee || 0,
        paid: Math.max(0, (s.shippingFee || 0) - (s.balance || 0)),
        balanceOwed: s.balance || 0,
        date: s.dateLabel || "",
      })),
      containers: containers.map((c) => ({
        id: c.id,
        number: c.number,
        size: c.size,
        route: c.route,
        status: c.status,
        boxes: c.boxes || 0,
        shipmentsCount: c.shipments ? c.shipments.length : 0,
        cost: c.cost || 0,
        profit: c.profit || 0,
      })),
      payments: payments.slice(0, 40).map((p) => ({
        id: p.id,
        shipmentId: p.shipmentId,
        clientName: p.clientName,
        type: p.type,
        method: p.method,
        amount: p.amount,
        date: p.date,
      })),
      clients: clients.slice(0, 40).map((c) => ({
        code: c.code,
        name: c.name,
        city: c.city,
        whatsapp: c.whatsapp,
      })),
      routes: routes.map((r) => ({
        name: r.name,
        pricePerKg: r.pricePerKg,
        pricePerCbm: r.pricePerCbm,
      })),
    };
  };

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    let targetThreadId = activeThreadId;
    const currentMessages = activeThread ? [...activeThread.messages] : [];

    if (!targetThreadId || !activeThread) {
      const newThread: CopilotThread = {
        id: `thr-${Date.now()}`,
        title: trimmed.slice(0, 42),
        updatedAt: "Just now",
        messages: [userMsg],
      };
      targetThreadId = newThread.id;
      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
    } else {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === targetThreadId
            ? {
                ...t,
                updatedAt: "Just now",
                messages: [...t.messages, userMsg],
              }
            : t
        )
      );
    }

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: currentMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          language,
          contextData: buildLiveContextSnapshot(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Copilot request failed.");
      }

      const exportAction: ExportSheetType | "none" =
        data.exportAction &&
        ["all", "shipments", "containers", "payments", "clients"].includes(
          data.exportAction
        )
          ? (data.exportAction as ExportSheetType)
          : "none";

      const assistantMsg: CopilotMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        text: data.reply || "Here is what I found in your agency records.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        metrics: Array.isArray(data.metrics) ? data.metrics : [],
        exportAction,
        followUpSuggestions: Array.isArray(data.followUpSuggestions)
          ? data.followUpSuggestions
          : [],
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === targetThreadId
            ? {
                ...t,
                updatedAt: "Just now",
                messages: [...t.messages, assistantMsg],
              }
            : t
        )
      );

      // If the user explicitly asked to export/download in their prompt, trigger download automatically too
      if (
        exportAction !== "none" &&
        /export|excel|csv|download|sheet|télécharger|导出|表格/i.test(trimmed)
      ) {
        handleExport(exportAction);
      }
    } catch (err: any) {
      const errorMsg: CopilotMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        text:
          err?.message ||
          "I couldn't reach Logislo Copilot right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === targetThreadId
            ? { ...t, messages: [...t.messages, errorMsg] }
            : t
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (speechRecRef.current) {
        try {
          speechRecRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    // Start recording
    speechInterimRef.current = "";
    audioChunksRef.current = [];

    // Also start browser SpeechRecognition if available for instant feedback
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.lang =
          language === "zh" ? "zh-CN" : language === "fr" ? "fr-FR" : "en-US";
        rec.continuous = true;
        rec.interimResults = true;
        rec.onresult = (event: any) => {
          let transcript = "";
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            speechInterimRef.current = transcript.trim();
            setInput(transcript.trim());
          }
        };
        rec.start();
        speechRecRef.current = rec;
      } catch {
        // Fallback to MediaRecorder + Gemini Transcribe
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        // If SpeechRecognition already captured text, we still refine with Gemini transcribe if needed
        if (audioBlob.size > 0) {
          setTranscribing(true);
          try {
            const reader = new FileReader();
            reader.onloadend = async () => {
              const base64Data = String(reader.result || "").split(",")[1];
              if (base64Data) {
                const res = await fetch("/api/copilot/transcribe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    audioBase64: base64Data,
                    mimeType: audioBlob.type || "audio/webm",
                    language,
                  }),
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.transcript) {
                    setInput(data.transcript);
                  }
                }
              }
              setTranscribing(false);
            };
            reader.readAsDataURL(audioBlob);
          } catch {
            setTranscribing(false);
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      // If microphone permission fails or isn't available, stop cleanly
      setIsRecording(false);
    }
  };

  const startNewChat = () => {
    setActiveThreadId(null);
    setHistoryOpen(false);
    setInput("");
  };

  const deleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (activeThreadId === id) {
      setActiveThreadId(null);
    }
  };

  const showProLock = plan === "Basic";

  return (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden select-none"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Minimalistic Gemini-style Top Bar */}
      <header className="h-[60px] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={back}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            style={{ backgroundColor: "var(--surface)" }}
            aria-label="Back"
          >
            <Icon name="back" size={18} color="var(--ink)" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[17px] font-extrabold tracking-tight text-[var(--ink)]">
              Logislo Copilot
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              Pro
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="h-9 px-3 rounded-full flex items-center gap-1.5 text-[12px] font-semibold cursor-pointer active:scale-95 transition-transform"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--ink)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <Icon name="history" size={15} color="var(--accent)" />
            <span>{threads.length}</span>
          </button>

          <button
            type="button"
            onClick={startNewChat}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--ink)",
              boxShadow: "var(--shadow-subtle)",
            }}
            aria-label={copy.newChat}
          >
            <Icon name="plus" size={17} color="var(--ink)" />
          </button>
        </div>
      </header>

      {/* Exported Toast Notice */}
      {exportedNotice && (
        <div
          className="mx-5 mb-2 px-3.5 py-2 rounded-full flex items-center justify-center gap-2 text-[12px] font-semibold"
          style={{
            backgroundColor: "var(--accent)",
            color: "#FFFFFF",
          }}
        >
          <Icon name="check" size={14} color="#FFFFFF" />
          <span>{exportedNotice}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 flex flex-col">
        {messages.length === 0 ? (
          /* Minimalistic Gemini-Inspired Zero State */
          <div className="flex-1 flex flex-col justify-center py-6">
            <div className="flex flex-col items-start gap-2 mb-8">
              <div
                className="w-11 h-11 rounded-[16px] flex items-center justify-center mb-2"
                style={{
                  background:
                    "linear-gradient(135deg, #0B5FFF 0%, #3B82F6 100%)",
                  color: "#FFFFFF",
                }}
              >
                <Icon name="sparkles" size={22} color="#FFFFFF" />
              </div>

              <h1
                className="text-[28px] font-extrabold tracking-tight leading-tight"
                style={{
                  background:
                    "linear-gradient(90deg, #0B0D17 0%, #0B5FFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {copy.welcome}
              </h1>

              <p className="text-[18px] font-semibold text-[var(--muted)] leading-snug">
                {copy.subtitle}
              </p>
            </div>

            {/* Minimalistic Suggestion Cards */}
            <div className="flex flex-col gap-2.5">
              {copy.prompts.map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendQuestion(promptText)}
                  className="w-full p-4 rounded-[18px] flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all"
                  style={{
                    backgroundColor: "var(--surface)",
                    boxShadow: "var(--shadow-subtle)",
                  }}
                >
                  <span className="text-[14px] font-medium text-[var(--ink)] pr-3">
                    {promptText}
                  </span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "var(--field)",
                      color: "var(--muted)",
                    }}
                  >
                    <Icon name="arrow-right" size={14} color="var(--muted)" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Conversation Thread */
          <div className="flex flex-col gap-5 pt-2">
            {messages.map((msg) => {
              if (msg.role === "user") {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div
                      className="max-w-[82%] px-4 py-3 rounded-[20px] rounded-br-[6px] text-[14px] font-medium leading-relaxed"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "#FFFFFF",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex flex-col gap-3 items-start">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--accent-tint)",
                        color: "var(--accent)",
                      }}
                    >
                      <Icon name="sparkles" size={13} color="var(--accent)" />
                    </div>
                    <span className="text-[12px] font-bold text-[var(--ink)]">
                      Logislo Copilot
                    </span>
                    <span className="text-[11px] text-[var(--muted)]">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* KPI Metric Callouts if returned */}
                  {msg.metrics && msg.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {msg.metrics.map((m, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-[14px] flex flex-col"
                          style={{
                            backgroundColor: "var(--surface)",
                            boxShadow: "var(--shadow-subtle)",
                          }}
                        >
                          <span className="text-[11px] font-medium text-[var(--muted)]">
                            {m.label}
                          </span>
                          <span className="text-[15px] font-extrabold text-[var(--ink)] mt-0.5">
                            {m.value}
                          </span>
                          {m.subtext && (
                            <span className="text-[10px] text-[var(--accent)] font-medium mt-0.5">
                              {m.subtext}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AI Reply Body */}
                  <div
                    className="w-full p-4 rounded-[18px] text-[14px] text-[var(--ink)] leading-relaxed whitespace-pre-line select-text"
                    style={{
                      backgroundColor: "var(--surface)",
                      boxShadow: "var(--shadow-subtle)",
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Inline Excel Export Action Button when relevant */}
                  {msg.exportAction && msg.exportAction !== "none" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleExport(msg.exportAction as ExportSheetType)
                      }
                      className="px-4 py-2.5 rounded-[14px] flex items-center gap-2 text-[13px] font-bold cursor-pointer active:scale-95 transition-transform"
                      style={{
                        backgroundColor: "var(--accent-tint)",
                        color: "var(--accent)",
                      }}
                    >
                      <Icon name="download" size={16} color="var(--accent)" />
                      <span>
                        {copy.downloadExcel} (
                        {msg.exportAction === "all"
                          ? "Full Excel Workbook"
                          : msg.exportAction}
                        )
                      </span>
                    </button>
                  )}

                  {/* Follow-up suggestions */}
                  {msg.followUpSuggestions &&
                    msg.followUpSuggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {msg.followUpSuggestions.map((sug, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => sendQuestion(sug)}
                            className="px-3 py-1.5 rounded-full text-[12px] font-medium cursor-pointer active:scale-95 transition-transform"
                            style={{
                              backgroundColor: "var(--field)",
                              color: "var(--ink)",
                            }}
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2.5 py-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center animate-pulse"
                  style={{
                    backgroundColor: "var(--accent-tint)",
                    color: "var(--accent)",
                  }}
                >
                  <Icon name="sparkles" size={13} color="var(--accent)" />
                </div>
                <span className="text-[13px] font-medium text-[var(--muted)]">
                  {copy.thinking}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Minimalistic Gemini-Style Bottom Input & Voice Bar */}
      <div className="px-4 pb-5 pt-2 shrink-0">
        {(isRecording || transcribing) && (
          <div
            className="mb-2 px-3.5 py-1.5 rounded-full flex items-center justify-between text-[12px] font-semibold"
            style={{
              backgroundColor: isRecording
                ? "var(--alert-tint)"
                : "var(--accent-tint)",
              color: isRecording ? "var(--alert)" : "var(--accent)",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{
                  backgroundColor: isRecording
                    ? "var(--alert)"
                    : "var(--accent)",
                }}
              />
              <span>{isRecording ? copy.listening : copy.transcribing}</span>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuestion(input);
          }}
          className="h-[54px] pl-4 pr-2 rounded-full flex items-center gap-2"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={copy.placeholder}
            className="flex-1 bg-transparent text-[15px] text-[var(--ink)] outline-none placeholder:text-[var(--placeholder)]"
          />

          {/* Microphone / Record Button (Supports Chinese, English, French) */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all shrink-0"
            style={{
              backgroundColor: isRecording
                ? "var(--alert)"
                : "var(--field)",
              color: isRecording ? "#FFFFFF" : "var(--ink)",
            }}
            aria-label="Voice input"
          >
            <Icon
              name="mic"
              size={18}
              color={isRecording ? "#FFFFFF" : "var(--ink)"}
            />
          </button>

          {/* Send Button */}
          {input.trim().length > 0 && (
            <button
              type="submit"
              disabled={loading}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all shrink-0"
              style={{
                backgroundColor: "var(--accent)",
                color: "#FFFFFF",
              }}
              aria-label="Send"
            >
              <Icon name="send" size={16} color="#FFFFFF" />
            </button>
          )}
        </form>
      </div>

      {/* Recent Chats Slide-Up Sheet */}
      {historyOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center"
          style={{ backgroundColor: "rgba(11, 13, 23, 0.45)" }}
          onClick={() => setHistoryOpen(false)}
        >
          <div
            className="w-full max-w-[390px] rounded-t-[24px] p-5 flex flex-col gap-3 max-h-[75vh]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-dialog)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-[17px] font-extrabold text-[var(--ink)]">
                {copy.recentChats}
              </span>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "var(--field)" }}
              >
                <Icon name="close" size={16} color="var(--ink)" />
              </button>
            </div>

            <button
              type="button"
              onClick={startNewChat}
              className="w-full h-[46px] px-4 rounded-[14px] flex items-center justify-center gap-2 text-[14px] font-bold cursor-pointer active:scale-[0.99] transition-transform"
              style={{
                backgroundColor: "var(--accent)",
                color: "#FFFFFF",
              }}
            >
              <Icon name="plus" size={16} color="#FFFFFF" />
              <span>{copy.newChat}</span>
            </button>

            <div className="flex flex-col gap-2 overflow-y-auto py-1">
              {threads.length === 0 ? (
                <div className="py-8 text-center text-[13px] text-[var(--muted)]">
                  {copy.noChats}
                </div>
              ) : (
                threads.map((thr) => {
                  const isCurrent = thr.id === activeThreadId;
                  return (
                    <div
                      key={thr.id}
                      onClick={() => {
                        setActiveThreadId(thr.id);
                        setHistoryOpen(false);
                      }}
                      className="p-3.5 rounded-[14px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
                      style={{
                        backgroundColor: isCurrent
                          ? "var(--accent-tint)"
                          : "var(--field)",
                      }}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-[14px] font-bold text-[var(--ink)] truncate">
                          {thr.title}
                        </span>
                        <span className="text-[11px] text-[var(--muted)]">
                          {thr.messages.length} messages · {thr.updatedAt}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => deleteThread(thr.id, e)}
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
                        aria-label="Delete thread"
                      >
                        <Icon name="trash" size={15} color="var(--muted)" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pro Plan Gate Overlay (When Owner is on Basic Plan) */}
      {showProLock && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: "rgba(11, 13, 23, 0.45)" }}
        >
          <div
            className="w-full max-w-[340px] p-6 rounded-[24px] flex flex-col items-center text-center gap-3 relative"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-dialog)",
            }}
          >
            <button
              type="button"
              onClick={back}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <Icon name="close" size={18} color="var(--muted)" />
            </button>

            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-1"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="sparkles" size={26} color="var(--accent)" />
            </div>

            <h3 className="text-[20px] font-extrabold text-[var(--ink)]">
              Logislo Copilot (Pro)
            </h3>

            <p className="text-[13px] text-[var(--muted)] leading-relaxed">
              Your personal executive AI for sales analytics, container margins,
              fast-moving cargo insights, voice queries (EN / FR / 中文), and
              instant Excel exports. Available exclusively on the Pro plan.
            </p>

            <div className="w-full pt-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => go("15")}
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
