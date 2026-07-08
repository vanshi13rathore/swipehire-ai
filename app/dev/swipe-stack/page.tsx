"use client";

import { SwipeStack } from "@/components/jobs";

export default function SwipeStackDevPage() {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground pb-32 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-12 text-center">Swipe Stack Testing</h1>
      <SwipeStack />
    </div>
  );
}
