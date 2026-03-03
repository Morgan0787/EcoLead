export type Profile = {
  id: string;
  role: "student" | "eco_club" | "government";
  group_size: number | null;
  awareness_level: "low" | "medium" | "high";
  zipcode: string;
  language: "en" | "ru" | "uz";
  created_at: string;
};

export type Plan = {
  id: string;
  user_id: string;
  title: string;
  goal_description: string;
  area_size_m2: number;
  season: "spring" | "summer" | "autumn" | "winter";
  zipcode: string;
  reminder_date: string | null;
  plan_json: unknown;
  created_at: string;
};

export type LogEntry = {
  id: string;
  plan_id: string;
  user_id: string;
  date: string;
  notes: string;
  status: "todo" | "in_progress" | "done";
  created_at: string;
};

export type ImpactPhoto = {
  id: string;
  plan_id: string;
  user_id: string;
  before_url: string;
  after_url: string;
  created_at: string;
};

