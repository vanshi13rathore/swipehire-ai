import { getCurrentSession } from "../supabase/auth";

export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return session !== null;
}

export async function requireAuth(): Promise<boolean> {
  return await isAuthenticated();
}

export async function requireGuest(): Promise<boolean> {
  const auth = await isAuthenticated();
  return !auth;
}
