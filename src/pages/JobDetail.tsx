import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { sampleJobs } from "@/data/jobs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const job = sampleJobs.find(j => j.job_id === jobId);

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll be in touch within 24 hours.",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate hover:text-navy transition-colors mb-6">
            <ArrowLeft size={16} />
            Back to search
          </Link>
          
          <div className="space-y-6">
            {/* Rate - prominently displayed */}
            <div className="text-3xl font-bold text-navy">
              {formatRate()}
            </div>
            
            {/* Job Title & Badges */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-foreground">
                {job.title}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="outline">{job.job_id}</Badge>
                <Badge variant={getPriorityVariant()}>{job.priority}</Badge>
              </div>
            </div>
            
            {/* Location & Details */}
            <div className="flex items-center gap-6 text-slate">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span className="font-medium">{job.city}, {job.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{job.onsite_type}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-surface">
              <h2 className="text-xl font-semibold mb-4">Position Details</h2>
              <div className="space-y-4">
                <p className="text-slate leading-relaxed">
                  Excellent opportunity for a {job.profession} in {job.specialty} at {formatRate()}. 
                  We are seeking a qualified professional to join our team in {job.city}, {job.state}.
                </p>
                
                <div>
                  <h3 className="font-semibold mb-2 text-navy">Key Highlights:</h3>
                  <ul className="space-y-2">
                    {job.description_points.map((point, index) => (
                      <li key={index} className="flex items-start gap-3 text-slate">
                        <span className="text-navy mt-1.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-surface-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-navy">Sendoc Offers:</h3>
                  <ul className="space-y-1 text-sm text-slate">
                    <li>• Weekly direct deposit</li>
                    <li>• Occurrence malpractice coverage</li>
                    {job.include_travel_lodging && <li>• Travel and lodging assistance</li>}
                    <li>• Professional licensing support</li>
                    <li>• 24/7 clinical support team</li>
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <p className="text-slate text-sm">
                    Let us know if you're available to pick up shifts or would like more details about this opportunity.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Application Form */}
          <div>
            <Card className="p-6 bg-surface sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-navy">Apply Now</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cv">Upload CV/Resume</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-surface-muted transition-colors cursor-pointer">
                    <Upload className="mx-auto mb-2 text-slate" size={24} />
                    <p className="text-sm text-slate">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX (Max 5MB)</p>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-navy hover:bg-navy-light"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;