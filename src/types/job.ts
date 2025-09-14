export interface Job {
  job_id: string;
  title: string;
  city: string;
  state: string;
  specialty: string;
  profession: 'MD' | 'DO' | 'NP' | 'PA' | 'CRNA' | 'CNM';
  rate_numeric: number;
  rate_unit: 'hour' | 'day';
  priority: 'High' | 'Medium' | 'Low';
  onsite_type: 'On-site' | 'Hybrid' | 'Tele';
  start_date?: string;
  description_points: string[];
  include_travel_lodging: boolean;
  notes_internal?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  jobs?: any[]; // Allow flexible job types for chat display
}