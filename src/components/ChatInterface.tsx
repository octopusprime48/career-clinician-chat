import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { ChatMessage } from "@/types/job";
// If you have JobCard, keep this import.
// If not, comment this line and the fallback simple list will render.
import { JobCard } from "./JobCard";

interface ChatInterfaceProps {
  initialMessage?: string;
}

// Change to your Render URL if different
const API_URL = "https://doctor-bot-backend.onrender.com";
const SESSION_KEY = "sendoc_session_id";

// Minimal Job shape used for rendering
type UIJob = {
  job_id: string;
  title: string;
  city: string;
  state: string;
  priority?: string;
  metaLine?: string;
  url?: string;
  rate_numeric?: number;
  rate_unit?: "hour" | "day";
};

export const ChatInterface = ({ initialMessage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // stable session id per browser
  const sessionId = useMemo(() => {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  }, []);

  // (optional) warm the backend to avoid cold-start delay on free tier
  useEffect(() => {
    fetch(`${API_URL}/`, { cache: "no-store" }).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialMessage) void sendMessage(initialMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMessage(messageText: string) {
    const text = messageText.trim();
    if (!text) return;

    // push user message
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // create a placeholder assistant message we will stream into
    const assistantId = `${Date.now()}-assistant`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        // @ts-ignore allow jobs on ChatMessage
        jobs: [] as UIJob[],
      },
    ]);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (!reader) throw new Error("No reader on response");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // parse SSE chunks separated by blank lines
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() || "";

        for (const ln of chunks) {
          if (!ln.startsWith("data:")) continue;
          const payload = JSON.parse(ln.slice(5).trim());

          if (payload.type === "text") {
            const delta: string = payload.data || "";
            setMessages((prev) =>
              prev.map((m: any) =>
                m.id === assistantId
                  ? { ...m, content: (m.content || "") + delta }
                  : m
              )
            );
          } else if (payload.type === "blocks") {
            // Backend sends [{ type: "jobs", items: [...] }]
            const items = payload.data?.[0]?.items ?? [];

            // Map to the UI job type (lenient so it won't crash)
            const mapped: UIJob[] = items.map((i: any) => {
              const rateStr = String(i.rate || "");
              const isDay = /day/i.test(rateStr);
              const num = Number((rateStr.match(/\d+/)?.[0]) || 0);
              return {
                job_id: i.job_id,
                title: i.title,
                city: i.city,
                state: i.state,
                priority: i.priority,
                metaLine: i.metaLine,
                url: i.url,
                rate_numeric: num,
                rate_unit: isDay ? "day" : "hour",
              };
            });

            setMessages((prev: any[]) =>
              prev.map((m: any) =>
                m.id === assistantId
                  ? {
                      ...m,
                      // attach jobs array so the UI section below can render JobCards
                      jobs: mapped,
                      // keep any streamed text as-is
                    }
                  : m
              )
            );
          }
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m: any) =>
          m.id === assistantId
            ? {
                ...m,
                content: (m.content || "") + "\n(Sorry, something went wrong.)",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(inputValue);
    setInputValue("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    void sendMessage(suggestion);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="mb-8 space-y-6">
          {messages.map((message: any) => (
            <div key={message.id} className="space-y-4">
              <div
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-3xl ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-slate text-white"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User size={16} />
                    ) : (
                      <Bot size={16} />
                    )}
                  </div>
                  <Card
                    className={`p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface border border-border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </Card>
                </div>
              </div>

              {/* Job Results (render when backend attaches jobs to this assistant turn) */}
              {message.jobs && message.jobs.length > 0 && (
                <div className="space-y-4 pl-11">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Recommended Positions
                  </h3>

                  {/* If you have JobCard, use it. Otherwise a simple list renders. */}
                  <div className="grid gap-4">
                    {typeof JobCard === "function"
                      ? message.jobs.map((job: UIJob) => (
                          <JobCard key={job.job_id} job={job as any} />
                        ))
                      : message.jobs.map((job: UIJob) => (
                          <Card
                            key={job.job_id}
                            className="p-4 bg-surface border border-border"
                          >
                            <div className="font-medium">{job.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {job.city}, {job.state} • {job.priority} •{" "}
                              {job.metaLine}
                            </div>
                            {job.url && (
                              <button
                                className="mt-2 text-sm underline"
                                onClick={() =>
                                  (window.location.href = job.url as string)
                                }
                              >
                                View details
                              </button>
                            )}
                          </Card>
                        ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex gap-3 justify-start mb-8">
          <div className="w-8 h-8 rounded-full bg-slate text-white flex items-center justify-center">
            <Bot size={16} />
          </div>
          <Card className="p-4 bg-surface border border-border">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-slate rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-slate rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-slate rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </Card>
        </div>
      )}

      {/* Input */}
      <Card className="p-4 bg-surface border border-border shadow-medium">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your next shift, lifestyle fit, or pay expectations..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-base"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !inputValue.trim()}
            className="shrink-0"
          >
            <Send size={16} />
          </Button>
        </form>

        {/* Suggested prompts */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Show me CRNA positions in Florida",
            "What are the highest paying specialties?",
            "Find urgent care jobs with good work-life balance",
          ].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestionClick(s)}
              className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80"
            >
              {s}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};


