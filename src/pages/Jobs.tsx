import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const API_URL = "https://doctor-bot-backend.onrender.com";

type Job = {
  job_id: string;
  title: string;
  city: string;
  state: string;
  priority?: string;
  metaLine?: string;
  rate?: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/jobs`)
      .then((r) => r.json())
      .then((data) => setJobs(data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Available Jobs</h1>

      {loading && <p>Loading jobs…</p>}
      {!loading && jobs.length === 0 && <p>No jobs available right now.</p>}

      <div className="grid gap-4">
        {jobs.map((j) => (
          <Card
            key={j.job_id}
            className="p-4 hover:bg-muted cursor-pointer"
            onClick={() => (window.location.href = `/jobs/${j.job_id}`)}
          >
            <div className="font-medium">{j.title}</div>
            <div className="text-sm text-muted-foreground">
              {j.city}, {j.state} • {j.priority} • {j.metaLine}
            </div>
            {j.rate && <div className="mt-1 text-sm">{j.rate}</div>}
          </Card>
        ))}
      </div>
    </div>
  );
}
