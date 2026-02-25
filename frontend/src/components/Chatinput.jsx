import React, { useState, useRef, useEffect } from "react";

export default function ChatInput({
  onSend,
  isLoading,
  prefill,
  onPrefillConsumed,
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);
  const canSubmit = value.trim().length > 0 && !isLoading;

  useEffect(() => {
    if (prefill) {
      setValue(prefill);
      onPrefillConsumed?.();
      textareaRef.current?.focus();
    }
  }, [prefill]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <div
        className={`flex items-end gap-3 rounded-2xl border px-4 py-3 transition-all duration-200
                ${
                  isLoading
                    ? "border-zinc-800 bg-zinc-900/50"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 focus-within:border-amber-500/40 focus-within:shadow-lg focus-within:shadow-amber-500/5"
                }`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isLoading
              ? "Agent is thinking..."
              : "Ask me anything about your tasks..."
          }
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-transparent resize-none outline-none text-sm text-zinc-200
                               placeholder:text-zinc-600 leading-relaxed disabled:cursor-not-allowed
                               disabled:opacity-50 min-h-6 max-h-40"
        />

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150
                        ${
                          canSubmit
                            ? "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95"
                            : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                        }`}
        >
          {isLoading ? (
            <svg
              className="w-3.5 h-3.5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-zinc-700 mt-2">
        Enter to send &middot; Shift+Enter for new line
      </p>
    </div>
  );
}
