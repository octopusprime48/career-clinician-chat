import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Bookmark } from "lucide-react";
import { Job } from "@/types/job";
import { Link } from "react-router-dom";

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const formatRate = () => {
    return `$${job.rate_numeric}/${job.rate_unit}`;
  };

  const getPriorityVariant = () => {
    switch (job.priority) {
      case "High":
        return "destructive";
      case "Medium": 
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="p-6 bg-surface border border-border hover:shadow-medium transition-all duration-200 group">
      <div className="space-y-4">
        {/* Rate - prominently displayed */}
        <div className="text-2xl font-bold text-navy">
          {formatRate()}
        </div>
        
        {/* Job Title */}
        <h3 className="text-lg font-semibold text-foreground group-hover:text-navy transition-colors">
          {job.title}
        </h3>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-slate">
          <MapPin size={16} />
          <span>{job.city}, {job.state}</span>
        </div>
        
        {/* Job Details Row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {job.job_id}
            </Badge>
            <Badge variant={getPriorityVariant()} className="text-xs">
              {job.priority}
            </Badge>
          </div>
        </div>
        
        {/* One-liner summary */}
        <p className="text-sm text-slate">
          {job.profession} • {job.specialty} • {job.onsite_type}
        </p>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            asChild
            size="sm" 
            className="bg-navy hover:bg-navy-light text-white transition-colors"
          >
            <Link to={`/jobs/${job.job_id}`}>
              Apply
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-border hover:bg-surface-muted transition-colors"
          >
            <Bookmark size={14} className="mr-2" />
            Save
          </Button>
        </div>
      </div>
    </Card>
  );
};