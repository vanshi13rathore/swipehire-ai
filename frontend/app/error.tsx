"use client";

import { useEffect } from "react";
import { Button } from "@/components/shared";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 space-y-4">
      <div className="text-red-500 font-semibold bg-red-100 px-4 py-2 rounded-xl">
        Something went wrong
      </div>
      <h2 className="text-2xl font-bold text-gray-900 text-center">
        An unexpected error occurred.
      </h2>
      <p className="text-gray-500 max-w-md text-center">
        {error.message || "We encountered an issue processing your request. Please try again."}
      </p>
      <Button onClick={() => reset()} size="lg">
        Try Again
      </Button>
    </div>
  );
}
