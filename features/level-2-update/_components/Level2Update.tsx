"use client";

import { Badge, Button, CampaignBadge, DatePickerField, Table, TypeBadge } from "@/components/ui";
import { type Column } from "@/components/ui/Table";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import clsx from "clsx";
import { ChevronDown, FileText, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { BRAND } from "@/types/brand.types";
import type { LEAD_TYPE } from "@/types/lead-type.types";
import {
  createEmptyLevel2UpdateRow,
  level2AgentOptions,
  level2LeadOptions,
  level2ResultUpdateOptions,
  level2UpdateCampaignOptions,
  level2UpdateLeadTypeOptions,
  level2UpdateRows,
  type Level2UpdateRow,
} from "../_lib/data";

const cellInputClass =
  "h-8 min-w-[8rem] w-full rounded-lg border border-transparent bg-transparent px-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-200 focus:bg-white focus:text-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:hover:bg-slate-800/70 dark:focus:border-slate-700 dark:focus:bg-slate-900";

const cellButtonClass =
  "flex h-8 w-full min-w-[8rem] items-center justify-between gap-2 rounded-lg border border-transparent bg-transparent px-2 py-1 text-left text-sm text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:text-slate-200 dark:hover:bg-slate-800/70";

const actionButtonClass =
  "inline-flex h-8 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition cursor-pointer";

const readTextClass =
  "block min-h-8 px-2.5 py-1.5 text-sm text-slate-700 dark:text-slate-200";

function ReadText({
  value,
  placeholder = "-",
}: {
  value: string;
  placeholder?: string;
}) {
  if (!value.trim()) {
    return (
      <span className={clsx(readTextClass, "text-slate-400 dark:text-slate-500")}>
        {placeholder}
      </span>
    );
  }

  return <span className={readTextClass}>{value}</span>;
}

function ResultBadge({ value }: { value: string }) {
  if (!value.trim()) {
    return <Badge className="text-slate-400 dark:text-slate-500">Select</Badge>;
  }

  if (value === "Fixed") {
    return <Badge variant="success">{value}</Badge>;
  }

  if (value === "Sent To Fix" || value === "On Hold") {
    return <Badge variant="warning">{value}</Badge>;
  }

  if (value === "Can't Locate") {
    return <Badge variant="error">{value}</Badge>;
  }

  return <Badge>{value}</Badge>;
}

function PickerPlaceholder({ label }: { label: string }) {
  return <span className="truncate px-0.5 text-slate-400 dark:text-slate-500">{label}</span>;
}

function LeadEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative min-w-[9rem]">
        <ListboxButton className={cellButtonClass}>
          {value ? (
            <span className="truncate px-0.5">{value}</span>
          ) : (
            <PickerPlaceholder label="Select lead" />
          )}
          <ChevronDown size={14} className="shrink-0 text-slate-400" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="z-[300] mt-1 w-[var(--button-width)] rounded-xl border border-slate-200 bg-white p-1 shadow-xl [--anchor-gap:0.25rem] dark:border-slate-700 dark:bg-slate-950"
        >
          <ListboxOption
            value=""
            className={({ focus }) =>
              clsx(
                "cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-400 dark:text-slate-500",
                focus && "bg-indigo-50 dark:bg-slate-800",
              )
            }
          >
            Select lead
          </ListboxOption>
          {level2LeadOptions.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className={({ focus }) =>
                clsx(
                  "cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200",
                  focus && "bg-indigo-50 dark:bg-slate-800",
                )
              }
            >
              {option.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

function CampaignEditor({
  value,
  onChange,
}: {
  value: BRAND | "";
  onChange: (value: BRAND | "") => void;
}) {
  return (
    <Listbox value={value} onChange={(nextValue) => onChange(nextValue as BRAND | "")}>
      <div className="relative min-w-[9rem]">
        <ListboxButton className={cellButtonClass}>
          {value ? (
            <CampaignBadge value={value} />
          ) : (
            <PickerPlaceholder label="Select campaign" />
          )}
          <ChevronDown size={14} className="shrink-0 text-slate-400" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="z-[300] mt-1 w-[var(--button-width)] rounded-xl border border-slate-200 bg-white p-1 shadow-xl [--anchor-gap:0.25rem] dark:border-slate-700 dark:bg-slate-950"
        >
          <ListboxOption
            value=""
            className={({ focus }) =>
              clsx(
                "cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-400 dark:text-slate-500",
                focus && "bg-indigo-50 dark:bg-slate-800",
              )
            }
          >
            Select campaign
          </ListboxOption>
          {level2UpdateCampaignOptions.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className={({ focus }) =>
                clsx(
                  "cursor-pointer rounded-lg px-3 py-2",
                  focus && "bg-indigo-50 dark:bg-slate-800",
                )
              }
            >
              <CampaignBadge value={option.value} />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

function LeadTypeEditor({
  value,
  onChange,
}: {
  value: LEAD_TYPE | "";
  onChange: (value: LEAD_TYPE | "") => void;
}) {
  return (
    <Listbox value={value} onChange={(nextValue) => onChange(nextValue as LEAD_TYPE | "")}>
      <div className="relative min-w-[11rem]">
        <ListboxButton className={cellButtonClass}>
          {value ? (
            <TypeBadge value={value} kind="lead" className="max-w-full" />
          ) : (
            <PickerPlaceholder label="Select type" />
          )}
          <ChevronDown size={14} className="shrink-0 text-slate-400" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="z-[300] mt-1 max-h-72 w-[var(--button-width)] overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl [--anchor-gap:0.25rem] dark:border-slate-700 dark:bg-slate-950"
        >
          <ListboxOption
            value=""
            className={({ focus }) =>
              clsx(
                "cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-400 dark:text-slate-500",
                focus && "bg-indigo-50 dark:bg-slate-800",
              )
            }
          >
            Select type
          </ListboxOption>
          {level2UpdateLeadTypeOptions.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className={({ focus }) =>
                clsx(
                  "cursor-pointer rounded-lg px-3 py-2",
                  focus && "bg-indigo-50 dark:bg-slate-800",
                )
              }
            >
              <TypeBadge value={option.value} kind="lead" />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

function ResultEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative min-w-[10rem]">
        <ListboxButton className={cellButtonClass}>
          <ResultBadge value={value} />
          <ChevronDown size={14} className="shrink-0 text-slate-400" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="z-[300] mt-1 max-h-72 w-[var(--button-width)] overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl [--anchor-gap:0.25rem] dark:border-slate-700 dark:bg-slate-950"
        >
          <ListboxOption
            value=""
            className={({ focus }) =>
              clsx(
                "cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-400 dark:text-slate-500",
                focus && "bg-indigo-50 dark:bg-slate-800",
              )
            }
          >
            Select result
          </ListboxOption>
          {level2ResultUpdateOptions.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className={({ focus }) =>
                clsx(
                  "cursor-pointer rounded-lg px-3 py-2",
                  focus && "bg-indigo-50 dark:bg-slate-800",
                )
              }
            >
              <ResultBadge value={option.value} />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

function AgentEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative min-w-[9rem]">
        <ListboxButton className={cellButtonClass}>
          {value ? (
            <span className="truncate px-0.5">{value}</span>
          ) : (
            <PickerPlaceholder label="Select agent" />
          )}
          <ChevronDown size={14} className="shrink-0 text-slate-400" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="z-[300] mt-1 w-[var(--button-width)] rounded-xl border border-slate-200 bg-white p-1 shadow-xl [--anchor-gap:0.25rem] dark:border-slate-700 dark:bg-slate-950"
        >
          <ListboxOption
            value=""
            className={({ focus }) =>
              clsx(
                "cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-400 dark:text-slate-500",
                focus && "bg-indigo-50 dark:bg-slate-800",
              )
            }
          >
            Select agent
          </ListboxOption>
          {level2AgentOptions.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className={({ focus }) =>
                clsx(
                  "cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200",
                  focus && "bg-indigo-50 dark:bg-slate-800",
                )
              }
            >
              {option.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

export function Level2Update() {
  const [rows, setRows] = useState(level2UpdateRows);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const updateRow = <K extends keyof Level2UpdateRow>(
    rowId: string,
    key: K,
    value: Level2UpdateRow[K],
  ) => {
    setRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, [key]: value } : row)),
    );
  };

  const handleAddLead = () => {
    const newRow = createEmptyLevel2UpdateRow(rows.length + 1);
    setRows((current) => [...current, newRow]);
    setEditingRowId(newRow.id);
  };

  const handleDelete = (rowId: string) => {
    setRows((current) => current.filter((row) => row.id !== rowId));
    setEditingRowId((current) => (current === rowId ? null : current));
  };

  const handleLogResult = (rowId: string) => {
    const today = new Date().toISOString().slice(0, 10);

    setRows((current) =>
      current.map((row) => {
        if (row.id !== rowId) {
          return row;
        }

        const resultLabel = row.level_2_result_update.trim() || "No result";
        const noteEntry = `[${today}] ${resultLabel}`;

        return {
          ...row,
          updated_notes: row.updated_notes
            ? `${row.updated_notes} | ${noteEntry}`
            : noteEntry,
        };
      }),
    );
  };

  const isEditingRow = (rowId: string) => editingRowId === rowId;

  const columns: Column<Level2UpdateRow>[] = [
    {
      title: "Lead",
      key: "lead",
      render: (row) =>
        isEditingRow(row.id) ? (
          <div onClick={(event) => event.stopPropagation()}>
            <LeadEditor
              value={row.lead}
              onChange={(value) => updateRow(row.id, "lead", value)}
            />
          </div>
        ) : (
          <ReadText value={row.lead} />
        ),
    },
    {
      title: "Campaign",
      key: "campaign",
      render: (row) =>
        isEditingRow(row.id) ? (
          <div onClick={(event) => event.stopPropagation()}>
            <CampaignEditor
              value={row.campaign}
              onChange={(value) => updateRow(row.id, "campaign", value)}
            />
          </div>
        ) : (
          <CampaignBadge value={row.campaign} />
        ),
    },
    {
      title: "level 2 agent",
      key: "level_2_agent",
      render: (row) =>
        isEditingRow(row.id) ? (
          <div onClick={(event) => event.stopPropagation()}>
            <AgentEditor
              value={row.level_2_agent}
              onChange={(value) => updateRow(row.id, "level_2_agent", value)}
            />
          </div>
        ) : (
          <ReadText value={row.level_2_agent} />
        ),
    },
    {
      title: "Level 2 result update",
      key: "level_2_result_update",
      render: (row) =>
        isEditingRow(row.id) ? (
          <div onClick={(event) => event.stopPropagation()}>
            <ResultEditor
              value={row.level_2_result_update}
              onChange={(value) =>
                updateRow(row.id, "level_2_result_update", value)
              }
            />
          </div>
        ) : (
          <ResultBadge value={row.level_2_result_update} />
        ),
    },
    {
      title: "Updated Notes",
      key: "updated_notes",
      render: (row) =>
        isEditingRow(row.id) ? (
          <input
            type="text"
            value={row.updated_notes}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) =>
              updateRow(row.id, "updated_notes", event.target.value)
            }
            className={cellInputClass}
            placeholder="Updated notes"
          />
        ) : (
          <ReadText value={row.updated_notes} />
        ),
    },
    {
      title: "Call back Date",
      key: "call_back_date",
      type: "date",
      render: (row) =>
        isEditingRow(row.id) ? (
          <div onClick={(event) => event.stopPropagation()}>
            <DatePickerField
              value={row.call_back_date}
              onChange={(value) =>
                updateRow(row.id, "call_back_date", value)
              }
              className={cellInputClass}
              placeholder="Pick a date"
            />
          </div>
        ) : (
          <ReadText value={row.call_back_date} />
        ),
    },
    {
      title: "Created date",
      key: "created_date",
      type: "date",
      render: (row) =>
        isEditingRow(row.id) ? (
          <div onClick={(event) => event.stopPropagation()}>
            <DatePickerField
              value={row.created_date}
              onChange={(value) =>
                updateRow(row.id, "created_date", value)
              }
              className={cellInputClass}
              placeholder="Pick a date"
            />
          </div>
        ) : (
          <ReadText value={row.created_date} />
        ),
    },
    {
      title: "Lead Type Sidago",
      key: "lead_type_sidago",
      render: (row) =>
        isEditingRow(row.id) ? (
          <div onClick={(event) => event.stopPropagation()}>
            <LeadTypeEditor
              value={row.lead_type_sidago}
              onChange={(value) => updateRow(row.id, "lead_type_sidago", value)}
            />
          </div>
        ) : (
          <TypeBadge value={row.lead_type_sidago} kind="lead" />
        ),
    },
    {
      title: "Lead Type Benton",
      key: "lead_type_benton",
      render: (row) =>
        isEditingRow(row.id) ? (
          <div onClick={(event) => event.stopPropagation()}>
            <LeadTypeEditor
              value={row.lead_type_benton}
              onChange={(value) => updateRow(row.id, "lead_type_benton", value)}
            />
          </div>
        ) : (
          <TypeBadge value={row.lead_type_benton} kind="lead" />
        ),
    },
    {
      title: "Lead Type 95 RM",
      key: "lead_type_95rm",
      render: (row) =>
        isEditingRow(row.id) ? (
          <div onClick={(event) => event.stopPropagation()}>
            <LeadTypeEditor
              value={row.lead_type_95rm}
              onChange={(value) => updateRow(row.id, "lead_type_95rm", value)}
            />
          </div>
        ) : (
          <TypeBadge value={row.lead_type_95rm} kind="lead" />
        ),
    },
    {
      title: "Log Result",
      key: "log_result",
      render: (row) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleLogResult(row.id);
          }}
          className={clsx(
            actionButtonClass,
            "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
          )}
        >
          <FileText size={16} />
          Log Result
        </button>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      render: (row) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete(row.id);
          }}
          className={clsx(
            actionButtonClass,
            "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
          )}
          aria-label={`Delete ${row.lead || "row"}`}
        >
          <Trash2 size={16} />
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 px-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Level 2 Update
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Update level 2 results, notes, callbacks, and lead types inline.
          </p>
        </div>

        <Button
          onClick={handleAddLead}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 cursor-pointer"
        >
          <Plus size={16} />
          Add Lead
        </Button>
      </div>

      <Table
        data={rows}
        columns={columns}
        title="Level 2 Update"
        description="Update level 2 results, notes, callbacks, and lead types inline."
        showToolbarTitle={false}
        onRowClick={(row) => setEditingRowId(row.id)}
      />
    </div>
  );
}
