import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { ChatMessage } from "@/types/job";
import { sampleJobs } from "@/data/jobs";
import { JobCard } from "./JobCard";

interface ChatInterfaceProps {
  initialMessage?: string;
}

export const ChatInterface = ({ initialMessage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response with job recommendations
    setTimeout(() => {
      let botResponse = "";
      let recommendedJobs = [];

      // Simple keyword matching for demo
      const input = messageText.toLowerCase();
      
      if (input.includes("crna") || input.includes("anesthesia")) {
        botResponse = "I found some excellent CRNA and anesthesia opportunities for you. The Pittsburgh cardiac position at $95/hour is particularly strong, and Chicago offers $280/hour for anesthesiologists. Both include solid call schedules.";
        recommendedJobs = sampleJobs.filter(job => 
          job.profession === "CRNA" || job.specialty.includes("Anesthesia")
        );
      } else if (input.includes("urgent care") || input.includes("primary")) {
        botResponse = "Here are some urgent care opportunities that might interest you. The Indianapolis hybrid position offers good work-life balance at $140/hour with telemedicine flexibility.";
        recommendedJobs = sampleJobs.filter(job => 
          job.specialty.includes("Urgent Care")
        );
      } else if (input.includes("high pay") || input.includes("salary") || input.includes("rate") || input.includes("150") || input.includes("paying")) {
        botResponse = "Looking at top-paying opportunities, interventional radiology in Charleston, WV offers $450/day, and Chicago anesthesiology pays $280/hour. These represent some of the higher compensation ranges in their respective markets.";
        recommendedJobs = sampleJobs.filter(job => 
          (job.rate_unit === "hour" && job.rate_numeric > 100) || 
          (job.rate_unit === "day" && job.rate_numeric > 300)
        );
      } else if (input.includes("pennsylvania") || input.includes("pa")) {
        botResponse = "Pennsylvania has some great opportunities. The Pittsburgh CRNA position offers $95/hour with travel and lodging covered. The cardiac surgery exposure would be excellent for your career development.";
        recommendedJobs = sampleJobs.filter(job => job.state === "PA");
      } else if (input.includes("balance") || input.includes("lifestyle")) {
        botResponse = "For excellent work-life balance, I'd recommend the Charleston NP position with a 4-day work week and the Indianapolis urgent care role with hybrid scheduling. Both offer great lifestyle benefits.";
        recommendedJobs = sampleJobs.filter(job => 
          job.specialty.includes("Urology") || job.specialty.includes("Urgent Care")
        );
      } else {
        botResponse = "Here are some current opportunities that match healthcare professionals like you. I've included a mix of specialties and locations based on market demand and competitive compensation.";
        recommendedJobs = sampleJobs.slice(0, 3);
      }

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant", 
        content: botResponse,
        timestamp: new Date(),
        jobs: recommendedJobs,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
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
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </Card>
                </div>
              </div>
              
              {/* Job Results */}
              {message.jobs && message.jobs.length > 0 && (
                <div className="space-y-4 pl-11">
                  <h3 className="text-sm font-medium text-muted-foreground">Recommended Positions</h3>
                  <div className="grid gap-4">
                    {message.jobs.map((job) => (
                      <JobCard key={job.job_id} job={job} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
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

      {/* Chat Input */}
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
      </Card>
    </div>
  );
};