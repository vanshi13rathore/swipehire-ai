"use client";

import { CareerChemistry } from "@/components/ai";

export default function CareerChemistryDevPage() {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground pb-32 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-12 text-center">Career Chemistry Panel</h1>
      
      <CareerChemistry />
    </div>
  );
}
