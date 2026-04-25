import { AgentSms } from "@/features/agent-sms/_components/AgentSms";

export const metadata = {
  title: "SMS - Mariz Cabido | Sidago CRM",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AgentSms agentName="Mariz Cabido" agentSlug="mariz-cabido" />;
}
