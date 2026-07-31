"use server";

import { revalidatePath } from "next/cache";

export async function revalidateMatches() {
  revalidatePath("/jobs");
  revalidatePath("/career-chemistry");
}
