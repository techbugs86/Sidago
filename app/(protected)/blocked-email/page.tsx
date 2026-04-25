import { BlockedEmail } from "@/features/blocked-email/_components/BlockedEmail";

export const metadata = {
  title: "Blocked Email | Sidago CRM",
  description:
    "Review and manage blocked email addresses across Sidago CRM.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <BlockedEmail />;
}
