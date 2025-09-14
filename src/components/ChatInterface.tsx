import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { ChatMessage } from "@/types/job";
// import { JobCard } from "./JobCard"; // optional: wire later if you want cards

interface ChatInterfaceProps {
  initialMessage?: string;
}

const API_URL = "https://doctor-bot-backend.onrender.com"; // ← your Render URL
const SESSION_KEY = "sendoc_session_id";

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

  useEffect(() => {
    if (initialMessage) {
      // fire a first message if the page wants to start with one
      void sendMessage(initialMessage);
    }
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
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // create a placeholder assistant message we will stream into
    const assistantId = `${Date.now()}-assistant`;
    setMessages(prev => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
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
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const ln of parts) {
          if (!ln.startsWith("data:")) continue;
          const payload = JSON.parse(ln.slice(5).trim());

          if (payload.type === "text") {
            const delta: string = payload.data || "";
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantId ? { ...m, content: (m.content || "") + delta } : m
              )
            );
          } else if (payload.type === "blocks") {
            // OPTIONAL: if you want to render real job cards with <JobCard/>,
            // map payload.data[0].items into your Job type and attach to the assistant message.
            // For now we just append a friendly note that results were included.
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantId
                  ? {
                      ...m,
                      content:
                        (m.content || "") +
                        "\n\nI’ve added a few positions below based on what you asked.",
                    }
                  : m
              )
            );
            // Example (wire later):
            // const items = payload.data?.[0]?.items ?? [];
            // setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, jobs: mapToYourJobType(items) } : m));
          }
        }
      }
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: (m.content || "") + "\n(Sorry, something went wrong.)" }
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
          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-slate text-white'
                  }`}>
                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <Card className={`p-4 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-surface border border-border'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </Card>
                </div>
              </div>

              {/* OPTIONAL: render job results if you later attach message.jobs */}
              {/* {message.jobs && message.jobs.length > 0 && (
                <div className="space-y-4 pl-11">
                  <h3 className="text-sm font-medium text-muted-foreground">Recommended Positions</h3>
                  <div className="grid gap-4">
                    {message.jobs.map((job) => (
                      <JobCard key={job.job_id} job={job} />
                    ))}
                  </div>
                </div>
              )} */}
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
              <div className="w-2 h-2 bg-slate rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-slate rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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

        {/* Suggested prompts (optional – keep your existing UI if you have one) */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Show me CRNA positions in Florida",
            "What are the highest paying specialties?",
            "Find urgent care jobs with good work-life balance",
          ].map(s => (
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

