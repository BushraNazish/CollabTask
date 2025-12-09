import { type UserRole } from "@/features/auth/types";

const SESSION_KEY = "collabtask_session";

export type StoredSession = {
  token: string;
  user: {
    name: string;
    email: string;
    role: UserRole;
    id?: number;
  };
};

export function loadSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch (err) {
    console.error("Failed to parse session", err);
    return null;
  }
}

export function persistSession(session: StoredSession) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error("Failed to persist session", err);
  }
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error("Failed to clear session", err);
  }
}
