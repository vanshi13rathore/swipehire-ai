import { supabase } from "./client";

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
  return user;
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error.message);
    return null;
  }
  return session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
    throw error;
  }
}
