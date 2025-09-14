import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy">Sendoc</h1>
              <p className="text-sm text-slate">Healthcare careers, powered by AI</p>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#" className="text-slate hover:text-navy transition-colors">Jobs</a>
              <a href="#" className="text-slate hover:text-navy transition-colors">Career Digest</a>
              <a href="#" className="text-slate hover:text-navy transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            Your next healthcare role, <br />
            <span className="text-slate">one conversation away</span>
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto leading-relaxed">
            Get personalized career guidance, explore opportunities, and find positions that match your lifestyle. 
            Ask about rates, locations, schedules — we'll guide you through it all.
          </p>
        </div>

        {/* Chat Interface */}
        <ChatInterface />

        {/* Suggestions */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">Try asking:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Show me CRNA positions in Pennsylvania",
              "What are the highest paying specialties?", 
              "Find urgent care jobs with good work-life balance",
              "I want $150+ per hour in the Midwest"
            ].map((suggestion, index) => (
              <button
                key={index}
                className="px-4 py-2 text-sm bg-surface-muted hover:bg-border rounded-full transition-colors text-slate hover:text-navy"
                onClick={() => {
                  // This would trigger the chat with the suggestion
                  console.log('Suggested query:', suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-muted mt-24">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-navy mb-4">Sendoc</h3>
              <p className="text-sm text-slate">
                The trusted career platform for healthcare professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-sm text-slate">
                <li><a href="#" className="hover:text-navy transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-navy transition-colors">Career Guidance</a></li>
                <li><a href="#" className="hover:text-navy transition-colors">Salary Data</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate">
                <li><a href="#" className="hover:text-navy transition-colors">Career Digest</a></li>
                <li><a href="#" className="hover:text-navy transition-colors">Market Insights</a></li>
                <li><a href="#" className="hover:text-navy transition-colors">Lifestyle Guides</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate">
                <li><a href="#" className="hover:text-navy transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-navy transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-navy transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 Sendoc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
