import type { QuizAnswers } from "./scoring";
import type { ShortlistResult } from "./gemini";
import type { TCOResult } from "./tco";

export type ShortlistSession = {
  quiz_answers: QuizAnswers;
  shortlist: ShortlistResult;
  tco: TCOResult[];
  relaxation_applied?: string;
  ai_unavailable?: boolean;
  timestamp: number;
};

const SESSION_KEY = "shortlistai_session";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function saveSession(session: ShortlistSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage may be unavailable (e.g. private browsing) — session just won't persist.
  }
}

export function loadSession(): ShortlistSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as ShortlistSession;
    if (Date.now() - session.timestamp > MAX_AGE_MS) return null;
    return session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // localStorage may be unavailable — nothing to clear.
  }
}
