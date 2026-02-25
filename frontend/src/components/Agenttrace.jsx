const STATE_CONFIG = {
  PLAN: {
    label: "PLAN",
    color: "text-violet-400",
    dot: "bg-violet-500",
    border: "border-violet-500/20",
  },
  ACTION: {
    label: "ACTION",
    color: "text-sky-400",
    dot: "bg-sky-500",
    border: "border-sky-500/20",
  },
  OBSERVE: {
    label: "OBSERVE",
    color: "text-emerald-400",
    dot: "bg-emerald-500",
    border: "border-emerald-500/20",
  },
  ERROR: {
    label: "ERROR",
    color: "text-red-400",
    dot: "bg-red-500",
    border: "border-red-500/20",
  },
};

function TraceStep({ step, index }) {
  const cfg = STATE_CONFIG[step.state] ?? STATE_CONFIG.PLAN;
  return (
    <div
      className={`flex gap-3 py-2 px-3 rounded-lg border ${cfg.border} bg-black/20`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} opacity-80`} />
        <span
          className={`font-mono text-xs font-semibold ${cfg.color} tracking-widest w-16`}
        >
          {cfg.label}
        </span>
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        {step.tool && (
          <span className="font-mono text-xs text-sky-300/80 bg-sky-950/40 border border-sky-800/30 px-2 py-0.5 rounded w-fit">
            {step.tool}()
          </span>
        )}
        {step.thought && (
          <p className="text-xs text-zinc-500 leading-relaxed wrap-break-word whitespace-pre-wrap font-mono">
            {step.thought}
          </p>
        )}
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-amber-500/40 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      <span className="text-xs text-zinc-600 font-mono">thinking</span>
    </div>
  );
}

export default function AgentTrace({ trace, isLoading }) {
  if (!isLoading && trace.length === 0) return null;

  return (
    <div className="border-t border-zinc-900 bg-zinc-950/80">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-900">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-xs font-mono text-zinc-600 tracking-widest uppercase">
          Agent trace
        </span>
      </div>

      {/* Steps */}
      <div className="max-h-40 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-hide">
        {trace.map((step, i) => (
          <TraceStep key={i} step={step} index={i} />
        ))}
        {isLoading && <ThinkingDots />}
      </div>
    </div>
  );
}
