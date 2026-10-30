import { Router } from "express";
import { GoogleGenAI, Type } from "@google/genai";

export const copilotRouter = Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Server-side Logislo Copilot Chat Endpoint (Owner Pro Only)
copilotRouter.post("/copilot/chat", async (req, res) => {
  try {
    const { message, history = [], language = "en", contextData = {} } = req.body || {};

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const langName =
      language === "zh"
        ? "Chinese (Simplified 中文)"
        : language === "fr"
          ? "French (Français)"
          : "English";

    const systemInstruction = `You are Logislo Copilot, the exclusive executive AI assistant for the Owner of a freight and logistics agency ("${contextData.agencyName || "Logislo Agency"}").
Your user is ${contextData.ownerName || "the Owner"} (Role: Owner, Plan: Pro).

LIVE AGENCY DATA SNAPSHOT (Real-time database records for this company only):
${JSON.stringify(contextData, null, 2)}

YOUR CORE RESPONSIBILITIES:
1. Answer any question about sales, revenue collected, balances owed, shipments, containers, capacity, profitability, clients, and routes with 100% precision based on the LIVE AGENCY DATA SNAPSHOT above.
2. Provide proactive executive insights and recommendations:
   - Identify which products/cargo types (from shipment descriptions) are shipping and selling fastest.
   - Highlight container fill rates (CBM/weight), container profit margins, and whether pending shipments can be loaded to maximize profit.
   - Identify top clients by revenue/volume and flag clients who have outstanding unpaid balances.
3. If the workspace currently has 0 shipments or 0 records, clearly let the owner know their workspace is fresh and offer practical tips on what to log first (or answer their strategic freight questions).
4. EXCEL / REPORT EXPORTS:
   - Whenever the owner asks to export, download, or get an Excel sheet / CSV report of sales, shipments, products bought/shipped, containers, payments, or clients, set "exportAction" to the matching sheet:
     - "all" (Full multi-sheet Excel workbook with Executive Summary, Shipments, Containers, Payments, Clients)
     - "shipments" (Shipments & Cargo Manifest)
     - "containers" (Containers & Profitability)
     - "payments" (Sales & Payments Ledger)
     - "clients" (Clients & Balances)
     - "none" (when no export was requested, though you can still set it if an Excel sheet would be directly helpful to their query).
5. LANGUAGE & TONE:
   - If the owner writes or speaks in Chinese, French, or English, ALWAYS reply in that same language (default to ${langName} if ambiguous).
   - Keep answers executive, concise, clear, and well-structured. Use short bullet points where helpful. Avoid fluff.`;

    const recentHistoryText = Array.isArray(history)
      ? history
          .slice(-8)
          .map((m: { role: string; text: string }) => `${m.role === "user" ? "Owner" : "Logislo Copilot"}: ${m.text}`)
          .join("\n")
      : "";

    const fullPrompt = recentHistoryText
      ? `Previous conversation:\n${recentHistoryText}\n\nOwner's latest question: ${message}`
      : `Owner's question: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: "The direct, helpful executive response to the owner.",
            },
            metrics: {
              type: Type.ARRAY,
              description: "Optional up to 3 key metric callouts relevant to the question.",
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                  subtext: { type: Type.STRING },
                },
              },
            },
            exportAction: {
              type: Type.STRING,
              description: "One of: none, all, shipments, containers, payments, clients",
            },
            followUpSuggestions: {
              type: Type.ARRAY,
              description: "2 or 3 short follow-up questions the owner can tap next.",
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const rawText = (response.text ?? "{}").trim();
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = {
        reply: rawText,
        metrics: [],
        exportAction: "none",
        followUpSuggestions: [],
      };
    }

    res.json({
      reply: parsed.reply || "Here is your latest agency update.",
      metrics: Array.isArray(parsed.metrics) ? parsed.metrics.slice(0, 3) : [],
      exportAction: parsed.exportAction || "none",
      followUpSuggestions: Array.isArray(parsed.followUpSuggestions)
        ? parsed.followUpSuggestions.slice(0, 3)
        : [],
    });
  } catch (error: any) {
    console.error("Logislo Copilot error:", error);
    res.status(500).json({
      error: error?.message || "Failed to generate response from Logislo Copilot.",
    });
  }
});

// Server-side Audio Transcription Endpoint for Voice Input (Chinese, English, French)
copilotRouter.post("/copilot/transcribe", async (req, res) => {
  try {
    const { audioBase64, mimeType = "audio/webm", language = "en" } = req.body || {};

    if (!audioBase64 || typeof audioBase64 !== "string") {
      res.status(400).json({ error: "Audio data is required." });
      return;
    }

    const audioPart = {
      inlineData: {
        mimeType,
        data: audioBase64,
      },
    };

    const langHint =
      language === "zh"
        ? "The speaker may be speaking in Chinese (Mandarin), English, or French."
        : language === "fr"
          ? "The speaker may be speaking in French, English, or Chinese."
          : "The speaker may be speaking in English, French, or Chinese.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-transcribe",
      contents: {
        parts: [
          audioPart,
          {
            text: `Transcribe this spoken question accurately. ${langHint} Return only the transcribed text without any extra commentary.`,
          },
        ],
      },
    });

    res.json({
      transcript: (response.text ?? "").trim(),
    });
  } catch (error: any) {
    console.error("Logislo Copilot transcription error:", error);
    res.status(500).json({
      error: error?.message || "Could not transcribe audio.",
    });
  }
});
