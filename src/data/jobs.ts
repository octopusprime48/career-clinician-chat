import { Job } from "@/types/job";

export const sampleJobs: Job[] = [
  {
    job_id: "JO-10234",
    title: "CRNA - Cardiac Surgery Cases",
    city: "Pittsburgh",
    state: "PA",
    specialty: "Cardiac Anesthesia",
    profession: "CRNA",
    rate_numeric: 95,
    rate_unit: "hour",
    priority: "High",
    onsite_type: "On-site",
    start_date: "2024-10-15",
    description_points: [
      "Level 1 trauma center with robust cardiac surgery program",
      "Call schedule: 1:4 weekends, backup available",
      "Experience with TEE preferred but not required",
      "Collaborative team environment with attending coverage"
    ],
    include_travel_lodging: true,
    notes_internal: "Urgent need due to unexpected resignation"
  },
  {
    job_id: "JO-10198",
    title: "Anesthesiologist - General OR",
    city: "Chicago",
    state: "IL", 
    specialty: "Anesthesiology",
    profession: "MD",
    rate_numeric: 280,
    rate_unit: "hour",
    priority: "Medium",
    onsite_type: "On-site",
    description_points: [
      "High-volume academic medical center",
      "Mixed cases: general, orthopedic, ENT, plastic surgery",
      "No cardiac or neuro cases required",
      "Residents and CRNAs available for assistance"
    ],
    include_travel_lodging: false
  },
  {
    job_id: "JO-10176",
    title: "Urgent Care Physician",
    city: "Indianapolis", 
    state: "IN",
    specialty: "Urgent Care",
    profession: "DO",
    rate_numeric: 140,
    rate_unit: "hour",
    priority: "Low",
    onsite_type: "Hybrid",
    description_points: [
      "Fast-paced clinic seeing 25-35 patients per 10-hour shift",
      "Telemedicine component 2 days per week",
      "EMR: Epic, full scribe support available",
      "No procedures beyond simple suturing and joint injections"
    ],
    include_travel_lodging: false
  },
  {
    job_id: "JO-10145",
    title: "Interventional Radiologist",
    city: "Charleston",
    state: "WV",
    specialty: "Interventional Radiology", 
    profession: "MD",
    rate_numeric: 450,
    rate_unit: "day",
    priority: "High",
    onsite_type: "On-site",
    start_date: "2024-11-01",
    description_points: [
      "Regional referral center serving tri-state area",
      "Call coverage 1:3, primarily phone consults after hours",
      "Full range of IR procedures including TIPS, chemoembolization",
      "New Siemens equipment, experienced tech team"
    ],
    include_travel_lodging: true,
    notes_internal: "Partnership track available after 2 years"
  },
  {
    job_id: "JO-10089",
    title: "Nurse Practitioner - Urology",
    city: "Charleston",
    state: "WV",
    specialty: "Urology",
    profession: "NP", 
    rate_numeric: 58,
    rate_unit: "hour",
    priority: "Medium",
    onsite_type: "On-site",
    description_points: [
      "Outpatient clinic with minor procedure capability",
      "Collaborative practice with 3 urologists",
      "Cystoscopies, prostate biopsies, stone management",
      "4-day work week, excellent work-life balance"
    ],
    include_travel_lodging: false
  },
  {
    job_id: "JO-10067",
    title: "Physician Assistant - Emergency Medicine",
    city: "Fort Wayne",
    state: "IN",
    specialty: "Emergency Medicine",
    profession: "PA",
    rate_numeric: 68,
    rate_unit: "hour", 
    priority: "High",
    onsite_type: "On-site",
    description_points: [
      "Level 2 trauma center, 45,000 annual visits",
      "Fast track and main ED coverage available",
      "Excellent physician supervision and mentorship",
      "Shift differentials for nights and weekends"
    ],
    include_travel_lodging: false,
    notes_internal: "Previous PA left for family reasons, great opportunity"
  }
];