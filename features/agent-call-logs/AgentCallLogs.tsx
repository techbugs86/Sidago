"use client";

import { useMemo, useState } from "react";
import {
  Ban,
  ChevronDown,
  ChevronRight,
  Clock3,
  MessageCircleWarning,
  MessageSquareText,
  PhoneCall,
  PhoneOff,
  Search,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  Button,
  CardShell,
  CheckboxInput,
  CompanySymbolBadge,
  DatePickerField,
  EmptyState,
  Select,
  TextInput,
  Textarea,
  TimezoneBadge,
  TypeBadge,
} from "@/components/ui";
import { OutcomeButton } from "@/features/agent-calls/_components/OutcomeButton";
import {
  getCompanySymbol,
  getLeadId,
} from "@/features/backoffice-shared/constants";
import { getStoredLeads } from "@/features/leads/_lib/storage";
import type { LeadDirectoryRow } from "@/features/leads/_lib/data";
import clsx from "clsx";
import { AGENT_VALUES } from "@/types/agent.types";
import { CONTACT_TYPE_VALUES } from "@/types/contact-type.types";
import { LEAD_TYPE_VALUES } from "@/types/lead-type.types";

type LeadGroup = {
  leadType: string;
  timezones: Array<{
    timezone: string;
    leads: LeadDirectoryRow[];
  }>;
};

type EditableCallLogState = {
  fullName: string;
  phone: string;
  email: string;
  contactType: string;
  svgLeadType: string;
  svgToBeCalledBy: string;
  notes: string;
  additionalContacts: string;
  doesNotWorkAnymore: boolean;
  callBackDate: string;
  historyCalls: string;
  historyNotes: string;
  selectedOutcome: string;
};

const defaultHistoryCalls = `04/17/2026 - LEVEL 2 TOM - No Answer
04/13/2026 - LEVEL 1 TOM - Left Voicemail
04/10/2026 - LEVEL 1 TOM - No Answer`;
const defaultHistoryNotes = `04/17/2026 - LEVEL 2 TOM - No Answer
04/13/2026 - LEVEL 1 TOM - Left Voicemail
04/10/2026 - LEVEL 1 TOM - No Answer`;

const callOutcomes = [
  {
    label: "No Answer",
    icon: PhoneOff,
    className:
      "border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer",
  },
  {
    label: "Interested",
    icon: ThumbsUp,
    className:
      "bg-emerald-500 text-white shadow-sm shadow-emerald-200 hover:bg-emerald-400 dark:shadow-emerald-900/40 cursor-pointer",
  },
  {
    label: "Bad Number",
    icon: MessageCircleWarning,
    className:
      "bg-blue-500 text-white shadow-sm shadow-blue-200 hover:bg-blue-400 dark:shadow-blue-900/40 cursor-pointer",
  },
  {
    label: "Not Interested",
    icon: ThumbsDown,
    className: "bg-slate-600 text-white hover:bg-slate-500 cursor-pointer",
  },
  {
    label: "Left Message",
    icon: MessageSquareText,
    className:
      "border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer",
  },
  {
    label: "Call Lead Back",
    icon: Clock3,
    className:
      "bg-rose-500 text-white shadow-sm shadow-rose-200 hover:bg-rose-400 dark:shadow-rose-900/40 cursor-pointer",
  },
  {
    label: "Interested Again",
    icon: PhoneCall,
    className:
      "bg-cyan-500 text-white shadow-sm shadow-cyan-200 hover:bg-cyan-400 dark:shadow-cyan-900/40 cursor-pointer",
  },
  {
    label: "DNC",
    icon: Ban,
    className: "bg-slate-700 text-white hover:bg-slate-600 cursor-pointer",
  },
] as const;

function getLeadTypeLabel(row: LeadDirectoryRow) {
  return row.svgLeadType || row.lead || "Uncategorized";
}

function getTimezoneLabel(row: LeadDirectoryRow) {
  return row.timezone || "Unknown";
}

function getPathKey(leadType: string, timezone: string) {
  return `${leadType}__${timezone}`;
}

function matchesSearch(row: LeadDirectoryRow, query: string) {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const leadId = getLeadId(row).toLowerCase();

  return [
    leadId,
    row.fullName,
    row.companyName,
    row.email,
    row.phone,
    getLeadTypeLabel(row),
    getTimezoneLabel(row),
  ]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalizedQuery));
}

function buildGroups(rows: LeadDirectoryRow[]): LeadGroup[] {
  const leadTypeMap = new Map<string, Map<string, LeadDirectoryRow[]>>();

  for (const row of rows) {
    const leadType = getLeadTypeLabel(row);
    const timezone = getTimezoneLabel(row);

    if (!leadTypeMap.has(leadType)) {
      leadTypeMap.set(leadType, new Map());
    }

    const timezoneMap = leadTypeMap.get(leadType)!;

    if (!timezoneMap.has(timezone)) {
      timezoneMap.set(timezone, []);
    }

    timezoneMap.get(timezone)!.push(row);
  }

  return Array.from(leadTypeMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([leadType, timezoneMap]) => ({
      leadType,
      timezones: Array.from(timezoneMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([timezone, groupedRows]) => ({
          timezone,
          leads: [...groupedRows].sort((a, b) =>
            getLeadId(a).localeCompare(getLeadId(b)),
          ),
        })),
    }));
}

function getEditableState(row: LeadDirectoryRow): EditableCallLogState {
  return {
    fullName: row.fullName,
    phone: row.phone,
    email: row.email,
    contactType: row.contactType,
    svgLeadType: row.svgLeadType || row.lead,
    svgToBeCalledBy: row.svgToBeCalledBy,
    notes: "",
    additionalContacts: "",
    doesNotWorkAnymore: row.notWorked ?? false,
    callBackDate: row.svgLastCallDate || row.lastActionDate,
    historyCalls: defaultHistoryCalls,
    historyNotes: defaultHistoryNotes,
    selectedOutcome: "",
  };
}

export function AgentCallLogs() {
  const [rows] = useState<LeadDirectoryRow[]>(() => getStoredLeads());
  const [search, setSearch] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const filteredRows = useMemo(
    () => rows.filter((row) => matchesSearch(row, search)),
    [rows, search],
  );
  const groups = useMemo(() => buildGroups(filteredRows), [filteredRows]);
  const [expandedLeadTypes, setExpandedLeadTypes] = useState<string[]>([]);
  const [expandedTimezones, setExpandedTimezones] = useState<string[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [formState, setFormState] = useState<{
    key: string;
    value: EditableCallLogState;
  } | null>(null);
  const firstGroup = groups[0];
  const firstTimezone = firstGroup?.timezones[0];
  const firstLead = firstTimezone?.leads[0] ?? filteredRows[0] ?? null;

  const visibleLeadTypes = useMemo(
    () => new Set(groups.map((group) => group.leadType)),
    [groups],
  );
  const visibleTimezoneKeys = useMemo(
    () =>
      new Set(
        groups.flatMap((group) =>
          group.timezones.map((timezoneGroup) =>
            getPathKey(group.leadType, timezoneGroup.timezone),
          ),
        ),
      ),
    [groups],
  );

  const activeExpandedLeadTypes = expandedLeadTypes.filter((leadType) =>
    visibleLeadTypes.has(leadType),
  );

  const activeExpandedTimezones = expandedTimezones.filter((key) =>
    visibleTimezoneKeys.has(key),
  );

  const selectedLead = useMemo(() => {
    if (selectedLeadId) {
      const matchedLead = filteredRows.find(
        (row) => getLeadId(row) === selectedLeadId,
      );

      if (matchedLead) {
        return matchedLead;
      }
    }

    return firstLead;
  }, [filteredRows, firstLead, selectedLeadId]);

  const form =
    selectedLead && formState?.key === getLeadId(selectedLead)
      ? formState.value
      : selectedLead
        ? getEditableState(selectedLead)
        : null;

  const agentOptions = useMemo(
    () =>
      AGENT_VALUES.map((agent) => ({
        label: `${agent.name} ${agent.surname}`,
        value: `${agent.name} ${agent.surname}`,
      })),
    [],
  );

  const contactTypeOptions = useMemo(
    () => CONTACT_TYPE_VALUES.map((value) => ({ label: value, value })),
    [],
  );

  const leadTypeOptions = useMemo(
    () => LEAD_TYPE_VALUES.map((value) => ({ label: value, value })),
    [],
  );

  const toggleLeadType = (leadType: string) => {
    const isOpen = activeExpandedLeadTypes.includes(leadType);

    setExpandedLeadTypes(isOpen ? [] : [leadType]);

    if (!isOpen) {
      const targetGroup = groups.find((group) => group.leadType === leadType);
      const firstTimezoneLabel = targetGroup?.timezones[0]?.timezone;

      setExpandedTimezones(
        firstTimezoneLabel ? [getPathKey(leadType, firstTimezoneLabel)] : [],
      );
    }
  };

  const toggleTimezone = (leadType: string, timezone: string) => {
    const key = getPathKey(leadType, timezone);
    const isOpen = activeExpandedTimezones.includes(key);

    setExpandedTimezones(isOpen ? [] : [key]);
  };

  const updateForm = <Key extends keyof EditableCallLogState>(
    key: Key,
    value: EditableCallLogState[Key],
  ) => {
    if (!selectedLead || !form) {
      return;
    }

    setFormState({
      key: getLeadId(selectedLead),
      value: {
        ...form,
        [key]: value,
      },
    });
  };

  if (!rows.length) {
    return <EmptyState message="No leads found for call logs." />;
  }

  return (
    <div className="min-h-full">
      <main className="mx-auto px-4 py-4 sm:px-4 sm:py-6">
        <div className="overflow-hidden rounded bg-white shadow-sm dark:bg-gray-900">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)]">
            <section className="min-h-0 lg:h-[calc(100vh-8.5rem)] lg:border-r lg:border-slate-200 dark:lg:border-slate-700">
              <div className="flex h-full flex-col p-3 sm:p-4">
                <Button
                  onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
                  className="mb-4 flex w-full items-center justify-between rounded border border-slate-200 bg-slate-50 px-4 py-1 text-left lg:hidden dark:border-slate-700 dark:bg-slate-900/60"
                >
                  <span className="text-sm">Lead Type</span>
                  {isMobileSidebarOpen ? (
                    <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  )}
                </Button>

                <div
                  className={clsx(
                    "min-h-0 flex-1 overflow-y-auto pr-1 lg:block",
                    {
                      block: isMobileSidebarOpen,
                      hidden: !isMobileSidebarOpen,
                    },
                  )}
                >
                  <CardShell className="flex flex-col gap-4">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                          <TextInput
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search..."
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        {groups.length ? (
                          <div className="space-y-2">
                            {groups.map((group) => {
                              const isLeadTypeExpanded =
                                activeExpandedLeadTypes.includes(
                                  group.leadType,
                                );

                              return (
                                <div
                                  key={group.leadType}
                                  className="rounded border border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-900/50"
                                >
                                  <Button
                                    onClick={() =>
                                      toggleLeadType(group.leadType)
                                    }
                                    className="flex w-full items-center justify-between gap-3 p-2 rounded text-left cursor-pointer hover:bg-white dark:hover:bg-slate-800"
                                  >
                                    <div className="flex min-w-0 items-center gap-3">
                                      {isLeadTypeExpanded ? (
                                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                                      )}
                                      <span className="text-xs">Lead Type</span>
                                      <TypeBadge
                                        value={group.leadType}
                                        kind="lead"
                                      />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                      {group.timezones.reduce(
                                        (count, timezoneGroup) =>
                                          count + timezoneGroup.leads.length,
                                        0,
                                      )}
                                    </span>
                                  </Button>

                                  {isLeadTypeExpanded ? (
                                    <div className="mt-2 space-y-2 px-2 pb-2">
                                      {group.timezones.map(
                                        (timezoneGroup, timezoneIndex) => {
                                          const timezoneKey = getPathKey(
                                            group.leadType,
                                            timezoneGroup.timezone,
                                          );
                                          const isTimezoneExpanded =
                                            activeExpandedTimezones.includes(
                                              timezoneKey,
                                            );

                                          return (
                                            <div
                                              key={timezoneKey}
                                              className="rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950/60"
                                            >
                                              <Button
                                                onClick={() =>
                                                  toggleTimezone(
                                                    group.leadType,
                                                    timezoneGroup.timezone,
                                                  )
                                                }
                                                className="flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                                              >
                                                <div className="flex min-w-0 items-center gap-3">
                                                  {isTimezoneExpanded ? (
                                                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                                                  ) : (
                                                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                                                  )}
                                                  <span className="text-xs">
                                                    Timezone
                                                  </span>
                                                  <TimezoneBadge
                                                    timezone={
                                                      timezoneGroup.timezone
                                                    }
                                                    index={timezoneIndex}
                                                  />
                                                </div>
                                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                  {timezoneGroup.leads.length}
                                                </span>
                                              </Button>

                                              {isTimezoneExpanded ? (
                                                <div className="mt-2 flex flex-wrap gap-2 px-2 pb-2">
                                                  {timezoneGroup.leads.map(
                                                    (lead) => {
                                                      const leadId =
                                                        getLeadId(lead);
                                                      const isSelected =
                                                        selectedLead &&
                                                        getLeadId(
                                                          selectedLead,
                                                        ) === leadId;

                                                      return (
                                                        <Button
                                                          key={leadId}
                                                          onClick={() => {
                                                            setSelectedLeadId(
                                                              leadId,
                                                            );
                                                            setIsMobileSidebarOpen(
                                                              false,
                                                            );
                                                          }}
                                                          className={clsx(
                                                            "rounded-full text-xs transition cursor-pointer",
                                                            {
                                                              "font-bold":
                                                                isSelected,
                                                              "font-normal":
                                                                !isSelected,
                                                            },
                                                          )}
                                                        >
                                                          {leadId}
                                                        </Button>
                                                      );
                                                    },
                                                  )}
                                                </div>
                                              ) : null}
                                            </div>
                                          );
                                        },
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="rounded border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            No leads match the current search.
                          </div>
                        )}
                      </div>
                    </div>
                  </CardShell>
                </div>
              </div>
            </section>

            <section className="min-h-0 border-t border-slate-200 dark:border-slate-700 lg:h-[calc(100vh-8.5rem)] lg:border-t-0">
              <div className="h-full overflow-y-auto p-4 sm:p-5">
                {selectedLead && form ? (
                  <div className="space-y-5">
                    <DetailCard>
                      <div className="flex items-center justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <CompanySymbolBadge
                            symbol={getCompanySymbol(selectedLead.companyName)}
                            index={0}
                            className="rounded"
                          />
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400">
                              Company
                            </p>
                            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {selectedLead.companyName}
                            </p>
                          </div>
                        </div>
                        <TimezoneBadge timezone={selectedLead.timezone} index={0} />
                      </div>
                    </DetailCard>

                    <DetailCard label="Personal Details">
                      <EditableField label="Full Name">
                        <TextInput
                          value={form.fullName}
                          onChange={(event) =>
                            updateForm("fullName", event.target.value)
                          }
                          className="text-xs font-semibold"
                        />
                      </EditableField>
                      <EditableField label="Phone">
                        <TextInput
                          value={form.phone}
                          onChange={(event) =>
                            updateForm("phone", event.target.value)
                          }
                          className="text-xs font-semibold"
                        />
                      </EditableField>
                      <EditableField label="Email">
                        <TextInput
                          type="email"
                          value={form.email}
                          onChange={(event) =>
                            updateForm("email", event.target.value)
                          }
                          className="text-xs font-semibold"
                        />
                      </EditableField>
                    </DetailCard>

                    <DetailCard label="Lead Details">
                      <EditableField label="Contact Type">
                        <Select
                          value={form.contactType}
                          onChange={(value) =>
                            updateForm("contactType", String(value))
                          }
                          options={contactTypeOptions}
                          className="text-xs font-semibold"
                        />
                      </EditableField>
                      <EditableField label="Lead Type">
                        <Select
                          value={form.svgLeadType}
                          onChange={(value) =>
                            updateForm("svgLeadType", String(value))
                          }
                          options={leadTypeOptions}
                          className="text-xs font-semibold"
                        />
                      </EditableField>
                      <EditableField label="To Be Called By">
                        <Select
                          value={form.svgToBeCalledBy}
                          onChange={(value) =>
                            updateForm("svgToBeCalledBy", String(value))
                          }
                          options={agentOptions}
                          className="text-xs font-semibold"
                        />
                      </EditableField>
                    </DetailCard>

                    <DetailCard label="Notes">
                      <EditableField label="Notes" align="stack">
                        <Textarea
                          value={form.notes}
                          onChange={(event) =>
                            updateForm("notes", event.target.value)
                          }
                          className="text-xs font-semibold leading-5"
                          placeholder="Add notes"
                        />
                      </EditableField>
                      <EditableField label="Doesn't Work Anymore In The Company">
                        <CheckboxInput
                          checked={form.doesNotWorkAnymore}
                          onChange={(event) =>
                            updateForm(
                              "doesNotWorkAnymore",
                              event.target.checked,
                            )
                          }
                          labelClassName="justify-end"
                        />
                      </EditableField>
                      <EditableField label="Call Back Date">
                        <DatePickerField
                          value={form.callBackDate}
                          onChange={(value) => updateForm("callBackDate", value)}
                          className="text-xs font-semibold"
                        />
                      </EditableField>
                    </DetailCard>

                    <DetailCard label="History">
                      <EditableField label="History Calls" align="stack">
                        <Textarea
                          value={form.historyCalls}
                          onChange={(event) =>
                            updateForm("historyCalls", event.target.value)
                          }
                          className="text-xs font-semibold leading-5"
                        />
                      </EditableField>
                      <EditableField label="History Notes" align="stack">
                        <Textarea
                          value={form.historyNotes}
                          onChange={(event) =>
                            updateForm("historyNotes", event.target.value)
                          }
                          className="text-xs font-semibold leading-5"
                        />
                      </EditableField>
                    </DetailCard>

                    <DetailCard label="Additional Contacts">
                      <EditableField label="Contacts" align="stack">
                        <Textarea
                          value={form.additionalContacts}
                          onChange={(event) =>
                            updateForm("additionalContacts", event.target.value)
                          }
                          className="text-xs font-semibold leading-5"
                          placeholder="Add contacts"
                        />
                      </EditableField>
                    </DetailCard>

                    <DetailCard label="Call Outcome">
                      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {callOutcomes.map((outcome) => (
                          <OutcomeButton
                            key={outcome.label}
                            label={outcome.label}
                            icon={outcome.icon}
                            onClick={() =>
                              updateForm("selectedOutcome", outcome.label)
                            }
                            className={outcome.className}
                          />
                        ))}
                      </div>
                    </DetailCard>
                  </div>
                ) : (
                  <EmptyState message="Select a lead to view call log details." />
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailCard({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      {typeof label === "string" && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </p>
      )}
      <div className="space-y-0">{children}</div>
    </div>
  );
}

function EditableField({
  label,
  children,
  align = "row",
}: {
  label: string;
  children: React.ReactNode;
  align?: "row" | "stack";
}) {
  return (
    <div
      className={
        align === "stack"
          ? "space-y-1 py-2"
          : "flex items-center justify-between gap-4 py-1.5"
      }
    >
      <p className="shrink-0 text-[10px] uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <div className={align === "stack" ? "w-full" : "w-64 max-w-[65%]"}>
        {children}
      </div>
    </div>
  );
}
