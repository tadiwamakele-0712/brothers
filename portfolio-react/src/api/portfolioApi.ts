import {
  API_BASE,
  type ApiMessage,
  type ApiProjectSummary,
  type ContactPayload,
} from "./client";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `API error ${res.status}`);
  }
  return res.json();
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    await apiFetch<{ ok: boolean }>("/health");
    return true;
  } catch {
    return false;
  }
}

export async function fetchSkills(): Promise<string[]> {
  const data = await apiFetch<{ skills: string[] }>("/skills");
  return data.skills;
}

export async function fetchApiProjects(): Promise<ApiProjectSummary[]> {
  const data = await apiFetch<{ projects: ApiProjectSummary[] }>("/projects");
  return data.projects;
}

export async function fetchMessages(): Promise<ApiMessage[]> {
  const data = await apiFetch<{ messages: ApiMessage[] }>("/messages");
  return data.messages;
}

export async function postContact(payload: ContactPayload): Promise<void> {
  await apiFetch("/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
