import { AgentCallLogs } from "@/features/agent-call-logs/AgentCallLogs";

export const metadata = {
  title: "Call Logs | Sidago CRM",
  description:
    "Sidago CRM is a secure and scalable customer relationship management platform designed to help businesses manage leads, track interactions, and build stronger customer connections with ease.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AgentCallLogs />;
}
