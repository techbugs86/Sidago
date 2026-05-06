"use client";

import { AgentScoreCards } from "@/features/backoffice-dashboard/_components/AgentScoreCards";

export default function AdminDashboard() {
  return (
    <main className="min-h-full p-6 md:p-8">
      <div className="space-y-6">
        <AgentScoreCards />
      </div>
    </main>
  );
}
