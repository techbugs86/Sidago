import { Level2Update } from "@/features/level-2-update/_components/Level2Update";

export const metadata = {
  title: "Level 2 Update | Sidago CRM",
  description:
    "Update level 2 lead results, notes, callback dates, and lead types inline.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <Level2Update />;
}
