import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import AgentTrace from "./AgentTrace.jsx";

const SUGGESTIONS = [
  { icon: "📋", text: "Show all my tasks" },
  { icon: "✏️", text: "Add buy groceries" },
  { icon: "🔍", text: "Search for work tasks" },
  { icon: "🗑️", text: "Delete the grocery task" },
];

function EmptyState({ onSuggestion }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center">
      
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <span className="text-2xl">✦</span>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-zinc-200 tracking-tight">
            What needs doing?
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Talk to your assistant — add, search, or delete tasks naturally.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
        {SUGGESTIONS.map(({ icon, text }) => (
          <button
            key={text}
            onClick={() => onSuggestion(text)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800
                                   hover:border-amber-500/30 hover:bg-zinc-800/80 transition-all duration-150
                                   text-left text-sm text-zinc-400 hover:text-zinc-200"
          >
            <span className="text-base">{icon}</span>
            <span className="text-xs leading-snug">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatWindow({
  messages,
  agentTrace,
  isLoading,
  onSuggestion,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentTrace]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
        {messages.length === 0 ? (
          <EmptyState onSuggestion={onSuggestion} />
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                role={msg.role}
                content={msg.content}
                data={msg.data}
                isError={msg.isError}
              />
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <AgentTrace trace={agentTrace} isLoading={isLoading} />
    </div>
  );
}
