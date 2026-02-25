import React, { useState, useCallback } from "react";
import ChatInput from "./components/ChatInput.jsx";
import TodoBoard from "./components/TodoBoard.jsx";
import { useChat } from "./hooks/useChat.js";
import ChatWindow from "./components/Chatwindow.jsx";

export default function App() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [prefill, setPrefill] = useState("");

  const triggerRefresh = useCallback(() => setRefreshSignal((s) => s + 1), []);
  const { messages, agentTrace, isLoading, sendMessage } =
    useChat(triggerRefresh);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-900 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <span className="text-amber-400 text-sm font-bold">✦</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold tracking-tight text-zinc-100">
              TASKLY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300
                        ${isLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`}
          />
          <span className="text-xs font-mono text-zinc-600">
            {isLoading ? "processing" : "ready"}
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <ChatWindow
            messages={messages}
            agentTrace={agentTrace}
            isLoading={isLoading}
            onSuggestion={(text) => setPrefill(text)}
          />

          <ChatInput
            onSend={sendMessage}
            isLoading={isLoading}
            prefill={prefill}
            onPrefillConsumed={() => setPrefill("")}
          />
        </main>

        <TodoBoard refreshSignal={refreshSignal} />
      </div>
    </div>
  );
}
