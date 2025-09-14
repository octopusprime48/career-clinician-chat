import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const API_URL = "https://doctor-bot-backend.onrender.com";

type Job = {
  job_id: string;
  title: string;
  city: string;
  state: string;
  priority?: "High" | "Medium" | "Low" | string;
  metaLine?: string;
  rate?: string;              // preformatted "$200/hr"
  rate_numeric?: number;      // optional numeric
  rate_unit?: "hour" | "day"; // optional unit
  description?: string;
  url?: string;               // external or internal detail link
};

export default function JobDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;

    setLoading(true);
    fetch(`${API_URL}/api/jobs/${jobId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setJob(data))
      .catch((err) => {
        console.error(err);
        toast({ title: "Job not found", description: "Please pick another role." });
        setJob(null);
      })
      .finally(() => setLoading(false));
  }, [jobId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading job…</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Job Not Found</h1>
          <Button onClick={() => navigate("/jobs")}>Return to Jobs</Button>
        </div>
      </div>
    );
  }

  const formattedRate =
    job.rate ??
    (job.rate_numeric && job.rate_unit
      ? `$${job.rate_numeric}/${job.rate_unit === "day" ? "day" : "hr"}`
      : undefined);

  const badgeVariant =
    job.priority === "High" ? "destructive" : job.priority === "Low" ? "secondary" : "default";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <Link to="/jobs" className="text-sm text-slate hover:text-navy transition-colors">
              All Jobs
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-slate">
            {job.city}, {job.state}
          </p>
          <div className="flex items-center gap-2">
            {job.priority && <Badge variant={badgeVariant}>{job.priority}</Badge>}
            {formattedRate && <Badge variant="outline">{formattedRate}</Badge>}
            {job.metaLine && <Badge variant="outline">{job.metaLine}</Badge>}
          </div>
        </div>

        <Card className="p-4">
          <h2 className="font-semibold mb-2">About this role</h2>
          <p className="text-sm leading-relaxed">
            {job.description ??
              "Details coming soon. Contact us for the full scope, schedule, and site information."}
          </p>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => navigate("/jobs")} variant="outline">
            Back to Jobs
          </Button>
          {job.url && (
            <Button onClick={() => (window.location.href = job.url)}>
              View / Apply
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
