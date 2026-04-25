import {
  getCompanySymbol,
  getLeadId,
} from "@/features/backoffice-shared/constants";
import { generateHotLeadRows } from "@/features/backoffice-shared/lead-mapper";

export type SmsBrand = "Sidago" | "Benton" | "95RM";

export type AgentSmsRow = {
  id: string;
  leadId: string;
  companyName: string;
  companySymbol: string;
  fullName: string;
  smsStatus: string;
  smsLog: string;
  brand: SmsBrand;
  phone: string;
  email: string;
};

export const smsAgentProfiles: Record<
  string,
  { agentName: string; brand: SmsBrand }
> = {
  "mariz-cabido": { agentName: "Mariz Cabido", brand: "Sidago" },
  "tom-silver": { agentName: "Tom Silver", brand: "Sidago" },
  "bryan-taylor": { agentName: "Bryan Taylor", brand: "Benton" },
  "chris-moore": { agentName: "Chris Moore", brand: "95RM" },
};

const smsStatuses = ["Queued", "Sent", "Delivered", "Replied", "Failed"];

function getSmsLog(brand: SmsBrand, index: number) {
  const label = `${brand} SMS Log`;
  const day = String(index + 10).padStart(2, "0");

  return `${label}: 04/${day}/2026 - Message ${
    index % 2 === 0 ? "sent" : "reviewed"
  } for lead follow-up.`;
}

export function getSmsRowsForAgent(agentSlug: string): AgentSmsRow[] {
  const profile = smsAgentProfiles[agentSlug] ?? {
    agentName: agentSlug,
    brand: "Sidago" as SmsBrand,
  };

  return generateHotLeadRows(12).map((lead, index) => ({
    id: `${agentSlug}-sms-${index + 1}`,
    leadId: getLeadId(lead),
    companyName: lead.companyName,
    companySymbol: getCompanySymbol(lead.companyName),
    fullName: lead.fullName,
    smsStatus: smsStatuses[index % smsStatuses.length],
    smsLog: getSmsLog(profile.brand, index),
    brand: profile.brand,
    phone: lead.phone,
    email: lead.email,
  }));
}
