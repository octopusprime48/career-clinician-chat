// src/components/ChatInterface.tsx
import { useEffect, useMemo, useRef, useState } from "react";

// ---- Types ----
type Job = {
  job_id: string;
  title: string;
  profession?: string;
  specialty?: string;
  city?: string;
  state?: string;
  rate_numeric?: number;
  rate_unit?: string;
};

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

// ---- Backend base URL (Render) ----
const BASE = "https://doctor-bot-backend.onrender.com";

export default function ChatInterface() {
  // Chat state
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content:
        "You are a job search assistant. Keep answers concise. When relevant, include nearby alternatives and return a 'jobs' array.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Parsed data returned alongside assistant text
  const [jobs, setJobs] = useState<Job[]>([]);
  const [lastReply, setLastReply] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Optional: direct search endpoint (kept from your version)
  async function runSearch(params: Record<string, string>) {
    setLoading(true);
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE}/api/${qs ? `search?${qs}` : "jobs"}`);
      const data = await res.json();
      const list: Job[] = Array.isArray(data) ? data : data?.jobs ?? [];
      setJobs(list);
      setLastReply(list.length ? "" : "No results.");
    } catch {
      setLastReply("Sorry, I couldn’t reach the server.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  // Core chat send that includes full history so follow-ups work
  async function sendChat() {
    const text = input.trim();
    if (!text || loading) return;

    // Optimistically add the user message
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      // IMPORTANT: send the *whole* conversation, not just the latest message
      const res = await fetch(`${BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Keep compatibility with your backend:
        // it can read either {message} or {messages}. We send both.
        body: JSON.stringify({ message: text, messages: nextMessages }),
      });

      // Your backend currently returns JSON (even if it also supports SSE).
      const data = await res.json();

      const assistantText: string =
        data?.text ??
        data?.reply ??
        data?.message ??
        "Sorry, I didn’t get that.";

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: assistantText,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setLastReply(assistantText);

      // If backend attached jobs, render them
      setJobs(Array.isArray(data?.jobs) ? (data.jobs as Job[]) : []);
    } catch (e) {
      const errMsg = "Sorry, I couldn’t reach the server.";
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
      setLastReply(errMsg);
      setJobs([]);
    } finally {
      setLoading(false);
      // keep focus on the input for quick follow-ups
      inputRef.current?.focus();
    }
  }

  // Enter-to-send
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendChat();
  }

  // Strip the initial system message from the visible chat
  const visibleMessages = useMemo(
    () => messages.filter((m) => m.role !== "system"),
    [messages]
  );

  useEffect(() => {
    // autofocus on mount
    inputRef.current?.focus();
  }, []);

  return (
    <div className="space-y-6">
      {/* Chat thread */}
      <div className="space-y-3">
        {visibleMessages.length === 0 ? (
          <div className="rounded-lg border p-4 text-sm opacity-70">
            Try: “Anything in Canada?”, “Show NP/PA jobs near Pittsburgh”, or
            “Find anesthesiology ≥ $300/hr in PA”.
          </div>
        ) : (
          visibleMessages.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg border p-4 whitespace-pre-wrap ${
                m.role === "assistant" ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="text-xs mb-1 opacity-60">
                {m.role === "assistant" ? "Assistant" : "You"}
              </div>
              {m.content}
            </div>
          ))
        )}

        {loading && (
          <div className="rounded-lg border p-4 text-sm opacity-70">Thinking…</div>
        )}
      </div>

      {/* Job results (only show when there are any) */}
      {jobs.length > 0 && (
        <div className="grid gap-4">
          {jobs.map((j) => (
            <a
              key={j.job_id}
              href={`/jobs/${encodeURIComponent(j.job_id)}`}
              className="block rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <div className="text-lg">{j.title}</div>
              <div className="text-sm opacity-70">
                {[j.city, j.state].filter(Boolean).join(", ")}{" "}
                {j.rate_numeric
                  ? ` • ${j.rate_numeric}/${j.rate_unit ?? "hour"}`
                  : ""}
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          className="flex-1 rounded border px-3 py-2"
          placeholder="Ask for jobs or about a location…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          onClick={sendChat}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}





