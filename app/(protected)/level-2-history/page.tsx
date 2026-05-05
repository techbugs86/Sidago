import { Level2History } from "@/features/level-2-history/_components/Level2History";

export const metadata = {
  title: "Level 2 History | Sidago CRM",
  description:
    "Review historical Level 2 lead updates, notes, and callback timelines.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <Level2History />;
}
