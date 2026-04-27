import { AdditionalContactsForm } from "@/features/additional-contacts/_components/AdditionalContactsForm";

export const metadata = {
  title: "Additional Contacts | Sidago CRM",
  description:
    "Add and associate additional contact records with existing companies in Sidago CRM.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AdditionalContactsForm />;
}
