"use client";

import {
  CompanySymbolBadge,
  Drawer,
  EditableDrawerFooter,
  EditableField,
  Select,
  Textarea,
  TextInput,
} from "@/components/ui";
import { AgentSmsRow } from "../_lib/data";

type AgentSmsDrawerProps = {
  row: AgentSmsRow | null;
  onCancel: () => void;
  onChange: (field: keyof AgentSmsRow, value: string) => void;
  onReset: () => void;
  onSave: () => void;
};

const smsStatusOptions = ["Queued", "Sent", "Delivered", "Replied", "Failed"].map(
  (value) => ({ label: value, value }),
);

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
        {value}
      </dd>
    </div>
  );
}

export function AgentSmsDrawer({
  row,
  onCancel,
  onChange,
  onReset,
  onSave,
}: AgentSmsDrawerProps) {
  return (
    <Drawer
      isOpen={Boolean(row)}
      onClose={onCancel}
      direction="right"
      size="min(560px, 100vw)"
      header={
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
            SMS Activity Detail
          </h2>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {row?.leadId ?? "SMS activity"}
          </p>
        </div>
      }
      footer={
        <EditableDrawerFooter
          onCancel={onCancel}
          onReset={onReset}
          onSave={onSave}
        />
      }
    >
      {row && (
        <dl className="grid gap-3">
          <DetailRow label="Lead ID" value={row.leadId} />
          <DetailRow
            label="Company Symbol"
            value={
              <CompanySymbolBadge
                symbol={row.companySymbol}
                index={0}
              />
            }
          />
          <DetailRow label="Company Name" value={row.companyName} />
          <EditableField label="Full Name">
            <TextInput
              value={row.fullName}
              onChange={(event) => onChange("fullName", event.target.value)}
              className="text-sm font-medium"
            />
          </EditableField>
          <EditableField label="Phone">
            <TextInput
              value={row.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              className="text-sm font-medium"
            />
          </EditableField>
          <EditableField label="Email">
            <TextInput
              type="email"
              value={row.email}
              onChange={(event) => onChange("email", event.target.value)}
              className="text-sm font-medium"
            />
          </EditableField>
          <DetailRow label="Brand" value={row.brand} />
          <EditableField label="SMS Status">
            <Select
              value={row.smsStatus}
              onChange={(value) => onChange("smsStatus", String(value))}
              options={smsStatusOptions}
              className="text-sm font-medium"
            />
          </EditableField>
          <EditableField label={`${row.brand} SMS Log`} align="stack">
            <Textarea
              value={row.smsLog}
              onChange={(event) => onChange("smsLog", event.target.value)}
              rows={4}
              className="text-sm font-medium leading-5"
            />
          </EditableField>
        </dl>
      )}
    </Drawer>
  );
}
