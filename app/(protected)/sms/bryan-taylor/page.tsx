import { AgentSms } from "@/features/agent-sms/_components/AgentSms";

export const metadata = {
  title: "SMS - Bryan Taylor | Sidago CRM",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AgentSms agentName="Bryan Taylor" agentSlug="bryan-taylor" />;
}
