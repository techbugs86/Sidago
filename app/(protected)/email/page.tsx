import { redirect } from "next/navigation";
import { AgentEmail } from "@/features/agent-email/_components/AgentEmail";

const AGENT_MAP = {
  "mariz-cabido": "Mariz Cabido",
  "tom-silver": "Tom Silver",
  "bryan-taylor": "Bryan Taylor",
  "chris-moore": "Chris Moore",
} as const;

export const metadata = {
  title: "Email | Sidago CRM",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string; agentId?: string }>;
}) {
  const params = await searchParams;
  const agentSlug = params.agent ?? params.agentId;

  if (!agentSlug || !(agentSlug in AGENT_MAP)) {
    redirect("/email?agent=mariz-cabido&agentId=mariz-cabido");
  }

  return (
    <AgentEmail
      agentName={AGENT_MAP[agentSlug as keyof typeof AGENT_MAP]}
      agentSlug={agentSlug}
    />
  );
}
