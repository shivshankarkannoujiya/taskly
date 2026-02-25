import { useState, useCallback, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useChat = (onTodosChange) => {
  const [messages, setMessages] = useState([]);
  const [agentTrace, setAgentTrace] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const historyRef = useRef([]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return;

      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setAgentTrace([]);
      setIsLoading(true);

      try {
        const res = await fetch(`${API_BASE}/api/v1/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history: historyRef.current }),
        });

        if (!res.ok) throw new Error("Server error");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop();

          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data: ")) continue;
            try {
              handleEvent(JSON.parse(line.slice(6)));
            } catch {
              /* skip malformed */
            }
          }
        }
      } catch (err) {
        console.error("useChat", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Connection error. Please try again.",
            isError: true,
          },
        ]);
      } finally {
        setIsLoading(false);
        setAgentTrace([]);
      }
    },
    [isLoading],
  );

  const handleEvent = (event) => {
    switch (event.type) {
      case "state": {
        const { state, thought, tool, message, data } = event.data;
        if (state === "OUTPUT" || state === "ERROR") {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: message,
              data,
              isError: state === "ERROR",
            },
          ]);
        } else {
          setAgentTrace((prev) => [...prev, { state, thought, tool }]);
        }
        break;
      }
      case "observation": {
        setAgentTrace((prev) => [
          ...prev,
          {
            state: "OBSERVE",
            thought: JSON.stringify(event.data.observation, null, 2),
          },
        ]);
        onTodosChange?.();
        break;
      }
      case "history": {
        historyRef.current = event.data;
        break;
      }
      case "done": {
        onTodosChange?.();
        break;
      }
    }
  };

  return { messages, agentTrace, isLoading, sendMessage };
};
