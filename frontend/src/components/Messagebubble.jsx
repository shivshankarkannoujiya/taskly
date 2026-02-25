function TodoDataCard({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-zinc-700/50">
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/80 border-b border-zinc-700/50">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-xs font-mono font-semibold text-zinc-400 tracking-widest uppercase">
            Tasks
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-600 bg-zinc-900/60 px-2 py-0.5 rounded-full border border-zinc-700/40">
          {data.length}
        </span>
      </div>

      <div className="divide-y divide-zinc-800/60 bg-zinc-900/40">
        {data.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-800/30 transition-colors"
          >
            <span className="shrink-0 text-xs font-mono text-zinc-700 w-5 text-right">
              {index + 1}.
            </span>

            <div
              className="shrink-0 w-5 h-5 rounded-full border border-zinc-700
                                        flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            </div>

            <span className="flex-1 text-sm text-zinc-200 leading-snug wrap-break-word">
              {item.todo}
            </span>

            <span
              className="shrink-0 font-mono text-xs text-zinc-600 bg-zinc-800/60
                                         px-1.5 py-0.5 rounded border border-zinc-700/40"
            >
              #{String(item.id).padStart(3, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MessageBubble({ role, content, data, isError }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 mb-5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                             text-xs font-bold mt-0.5 border
                ${
                  isUser
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                    : isError
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
      >
        {isUser ? "U" : isError ? "!" : "A"}
      </div>

      {/* Bubble */}
      <div
        className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[78%]`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed border
                    ${
                      isUser
                        ? "bg-amber-500/10 text-amber-50 border-amber-500/20 rounded-tr-sm"
                        : isError
                          ? "bg-red-950/40 text-red-300 border-red-800/30 rounded-tl-sm"
                          : "bg-zinc-900 text-zinc-200 border-zinc-800 rounded-tl-sm"
                    }`}
        >
          <p className="whitespace-pre-wrap wrap-break-word">{content}</p>
          <TodoDataCard data={data} />
        </div>
      </div>
    </div>
  );
}
