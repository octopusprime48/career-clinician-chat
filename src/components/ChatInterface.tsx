// types
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

const [jobs, setJobs] = useState<Job[]>([]);
const [loading, setLoading] = useState(false);

// when sending a search (button or user text parsed as filters), call the API
async function runSearch(params: Record<string,string>) {
  setLoading(true);
  const query = new URLSearchParams(params).toString();
  const base = process.env.NEXT_PUBLIC_API_URL ?? '';
  const res = await fetch(`${base}/api/${query ? `search?${query}` : 'jobs'}`);
  const data = await res.json();
  // accept either [{...}] or {jobs:[...]}
  const next = Array.isArray(data) ? data : (data?.jobs ?? []);
  setJobs(next);
  setLoading(false);
}

// IMPORTANT: Do not add any fallback arrays here.
// If there are no results, show a clean "No results" state.
return (
  <>
    {/* ...your chat UI... */}

    {loading ? (
      <p>Loading…</p>
    ) : jobs.length === 0 ? (
      <p>No results.</p>
    ) : (
      <div className="grid gap-4">
        {jobs.map(j => (
          <a key={j.job_id} href={`/jobs/${encodeURIComponent(j.job_id)}`} className="block rounded-xl p-4 shadow">
            <div className="text-lg">{j.title}</div>
            <div className="text-sm opacity-70">
              {[j.city, j.state].filter(Boolean).join(', ')} · {j.rate_numeric ? `${j.rate_numeric}/${j.rate_unit ?? 'hour'}` : ''}
            </div>
          </a>
        ))}
      </div>
    )}
  </>
);



