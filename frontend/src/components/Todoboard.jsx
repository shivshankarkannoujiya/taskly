import React, { useEffect, useState, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function TodoItem({ todo, index }) {
  return (
    <li
      className="group flex items-start gap-3 px-3 py-2.5 rounded-xl
                       hover:bg-zinc-800/60 transition-all duration-150"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div
        className="shrink-0 w-4 h-4 mt-0.5 rounded-full border border-zinc-700
                            group-hover:border-amber-500/50 transition-colors duration-150 flex items-center justify-center"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-amber-500/50 transition-colors" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-300 leading-snug wrap-break-word">
          {todo.todo}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-xs text-zinc-700">
            #{String(todo.id).padStart(3, "0")}
          </span>
          {todo.created_at && (
            <span className="text-xs text-zinc-700">
              {new Date(todo.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export default function TodoBoard({ refreshSignal }) {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTodos = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/todos`);
      const data = await res.json();
      setTodos(data.todos ?? []);
    } catch (err) {
      console.error("TodoBoard", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);
  useEffect(() => {
    if (refreshSignal > 0) fetchTodos(true);
  }, [refreshSignal]);

  return (
    <aside className="w-72 shrink-0 flex flex-col border-l border-zinc-900 bg-zinc-950">
      {/* Header */}
      <div className="px-4 py-4 border-b border-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-zinc-500 tracking-widest uppercase">
              Tasks
            </span>
            {isRefreshing && (
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <span className="font-mono text-xs text-zinc-700 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
            {todos.length}
          </span>
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        {isLoading ? (
          <div className="flex flex-col gap-2 px-3 py-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-xl bg-zinc-900 animate-pulse"
                style={{ opacity: 1 - i * 0.2 }}
              />
            ))}
          </div>
        ) : todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center py-12">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <span className="text-lg">🗒️</span>
            </div>
            <div>
              <p className="text-sm text-zinc-600">No tasks yet</p>
              <p className="text-xs text-zinc-700 mt-0.5">
                Ask the assistant to add some
              </p>
            </div>
          </div>
        ) : (
          <ul className="px-1">
            {todos.map((todo, i) => (
              <TodoItem key={todo.id} todo={todo} index={i} />
            ))}
          </ul>
        )}
      </div>

      <div className="px-4 py-3 border-t border-zinc-900">
        <p className="text-xs text-zinc-700 font-mono text-center">
          {todos.length > 0
            ? `${todos.length} task${todos.length !== 1 ? "s" : ""} in queue`
            : "queue empty"}
        </p>
      </div>
    </aside>
  );
}
