"use server";

import { supabase } from "./client";
import type { CareerGoal, DashboardShare } from "./types";
import { z } from "zod";

const careerGoalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["Skill", "Application", "Interview", "Networking", "Other"]),
  target_date: z.string().optional(),
  status: z.enum(["Not Started", "In Progress", "Completed"]).optional(),
  progress: z.number().min(0).max(100).optional()
}).partial();

export async function getCareerGoals(): Promise<CareerGoal[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("career_goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as CareerGoal[];
}

export async function createCareerGoal(payload: Partial<CareerGoal>): Promise<CareerGoal> {
  const parsed = careerGoalSchema.parse(payload);
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("career_goals")
    .insert({
      user_id: user.id,
      ...parsed
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as CareerGoal;
}

export async function updateCareerGoal(id: string, updates: Partial<CareerGoal>): Promise<CareerGoal> {
  const parsed = careerGoalSchema.parse(updates);
  
  const { data, error } = await supabase
    .from("career_goals")
    .update(parsed)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as CareerGoal;
}

export async function deleteCareerGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from("career_goals")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function createDashboardShare(): Promise<DashboardShare> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const token = crypto.randomUUID();

  const { data, error } = await supabase
    .from("dashboard_shares")
    .insert({
      user_id: user.id,
      token
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as DashboardShare;
}

export async function getDashboardShares(): Promise<DashboardShare[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("dashboard_shares")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as DashboardShare[];
}
