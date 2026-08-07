"use server";

import { supabase } from "./client";
import type { CareerChat, ChatMessage } from "./types";

export async function getCareerChats(): Promise<CareerChat[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("career_chats")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as CareerChat[];
}

export async function getCareerChat(id: string): Promise<CareerChat> {
  const { data, error } = await supabase
    .from("career_chats")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as CareerChat;
}

export async function createCareerChat(title: string, messages: ChatMessage[] = []): Promise<CareerChat> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("career_chats")
    .insert({
      user_id: user.id,
      title,
      messages
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as CareerChat;
}

export async function updateCareerChat(id: string, messages: ChatMessage[], title?: string): Promise<void> {
  const payload: Record<string, unknown> = { messages };
  if (title) payload.title = title;

  const { error } = await supabase
    .from("career_chats")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteCareerChat(id: string): Promise<void> {
  const { error } = await supabase
    .from("career_chats")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
