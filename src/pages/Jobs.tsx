import { JobCard } from "@/components/JobCard";
import { sampleJobs } from "@/data/jobs";

const Jobs = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Available Positions
          </h1>
          <p className="text-muted-foreground">
            Find your next healthcare opportunity from {sampleJobs.length} available positions
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleJobs.map((job) => (
            <JobCard key={job.job_id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;