import { AgentSms } from "@/features/agent-sms/_components/AgentSms";

export const metadata = {
  title: "SMS - Chris Moore | Sidago CRM",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AgentSms agentName="Chris Moore" agentSlug="chris-moore" />;
}
