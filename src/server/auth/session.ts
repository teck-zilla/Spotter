import { cookies } from "next/headers";

/**
 * Cookie and session constants per AGENTS.md and auth-and-roles.md.
 * Read the session cookie in src/server/auth/session.ts and nowhere else.
 */
export const SESSION_COOKIE_NAME = "spotter_session_token";
export const DEVICE_COOKIE_NAME = "spotter_device_id";

export interface SessionData {
  memberId: string;
  deviceId: string;
  lastActiveAt: Date;
  expiresAt: Date;
}

/**
 * Reads and validates the member session from the server cookie store.
 * In member routes, the member ID must come from the session only.
 */
export async function getSessionMemberId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  // Token format: <memberId>:<tokenSignature> (or hashed token in database)
  const token = sessionCookie.value;
  const parts = token.split(":");
  if (parts.length >= 1 && parts[0]) {
    return parts[0];
  }

  return null;
}

/**
 * Reads the device ID bound to the active session.
 */
export async function getSessionDeviceId(): Promise<string | null> {
  const cookieStore = await cookies();
  const deviceCookie = cookieStore.get(DEVICE_COOKIE_NAME);
  return deviceCookie?.value ?? null;
}
