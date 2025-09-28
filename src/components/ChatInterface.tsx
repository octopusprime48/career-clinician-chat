// src/components/ChatInterface.tsx
import { useState } from "react";

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

// ---- Backend base URL (Render) ----
const BASE = "https://doctor-bot-backend.onrender.com";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reply, setReply] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Optional: direct search endpoint for filters UI (if you add it later)
  async function runSearch(params: Record<string, string>) {
    setLoading(true);
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE}/api/${qs ? `search?${qs}` : "jobs"}`);
      const data = await res.json();
      const list: Job[] = Array.isArray(data) ? data : (data?.jobs ?? []);
      setJobs(list);
      setReply(list.length ? "" : "No results.");
    } catch {
      setReply("Sorry, I couldn’t reach the server.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  async function sendChat() {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setReply(data?.text ?? "");
      setJobs(Array.isArray(data?.jobs) ? data.jobs : []);
    } catch {
      setReply("Sorry, I couldn’t reach the server.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Chat input */}
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Ask for jobs or about a location…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendChat()}
        />
        <button className="rounded bg-black px-4 py-2 text-white" onClick={sendChat}>
          Send
        </button>
      </div>

      {/* LLM reply text */}
      {reply && <div className="rounded-lg border p-4 whitespace-pre-wrap">{reply}</div>}

      {/* Results */}
      {loading ? (
        <p>Loading…</p>
      ) : jobs.length === 0 ? (
        <p>No results.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((j) => (
            <a
              key={j.job_id}
              href={`/jobs/${encodeURIComponent(j.job_id)}`}
              className="block rounded-xl p-4 shadow"
            >
              <div className="text-lg">{j.title}</div>
              <div className="text-sm opacity-70">
                {[j.city, j.state].filter(Boolean).join(", ")} •{" "}
                {j.rate_numeric ? `${j.rate_numeric}/${j.rate_unit ?? "hour"}` : ""}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}




