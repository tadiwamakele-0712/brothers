export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3001/api";

export interface ApiMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface ApiProjectSummary {
  title: string;
  tags: string[];
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}
