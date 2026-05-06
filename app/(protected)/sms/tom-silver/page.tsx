import { AgentSms } from "@/features/agent-sms/_components/AgentSms";

export const metadata = {
  title: "SMS - Tom Silver | Sidago CRM",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AgentSms agentName="Tom Silver" agentSlug="tom-silver" />;
}
