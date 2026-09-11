"use client";

import { HistorySection } from "@/components/home/history-section";

export default function HistoryPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Main History Content matching design */}
      <HistorySection />
    </div>
  );
}
