"use client";

import { CompanySymbolBadge, Drawer, EmailLink } from "@/components/ui";
import { AgentSmsRow } from "../_lib/data";

type AgentSmsDrawerProps = {
  row: AgentSmsRow | null;
  onClose: () => void;
};

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

export function AgentSmsDrawer({ row, onClose }: AgentSmsDrawerProps) {
  return (
    <Drawer
      isOpen={Boolean(row)}
      onClose={onClose}
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
          <DetailRow label="Full Name" value={row.fullName} />
          <DetailRow label="Phone" value={row.phone} />
          <DetailRow label="Email" value={<EmailLink value={row.email} />} />
          <DetailRow label="Brand" value={row.brand} />
          <DetailRow label="SMS Status" value={row.smsStatus} />
          <DetailRow label={`${row.brand} SMS Log`} value={row.smsLog} />
        </dl>
      )}
    </Drawer>
  );
}
