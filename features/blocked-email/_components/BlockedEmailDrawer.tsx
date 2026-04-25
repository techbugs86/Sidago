"use client";

import { Drawer, EmailLink, TypeBadge } from "@/components/ui";
import { BlockedEmailRow } from "../_lib/data";

type BlockedEmailDrawerProps = {
  row: BlockedEmailRow | null;
  onClose: () => void;
  onUnblock: (row: BlockedEmailRow) => void;
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

export function BlockedEmailDrawer({
  row,
  onClose,
  onUnblock,
}: BlockedEmailDrawerProps) {
  return (
    <Drawer
      isOpen={Boolean(row)}
      onClose={onClose}
      direction="right"
      size="min(560px, 100vw)"
      header={
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
            Review Blocked Email
          </h2>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {row?.leadId ?? "Blocked email entry"}
          </p>
        </div>
      }
      footer={
        <div className="flex flex-col gap-2 bg-white px-5 py-4 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          {row && (
            <button
              type="button"
              onClick={() => onUnblock(row)}
              className="cursor-pointer rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Unblock Email
            </button>
          )}
        </div>
      }
    >
      {row && (
        <dl className="grid gap-3">
          <DetailRow label="Lead ID" value={row.leadId} />
          <DetailRow
            label="Lead Type"
            value={<TypeBadge value={row.leadType} kind="lead" />}
          />
          <DetailRow
            label="Contact Type"
            value={<TypeBadge value={row.contactType} kind="contact" />}
          />
          <DetailRow label="Email" value={<EmailLink value={row.email} />} />
          <DetailRow
            label="Blocked Email"
            value={<EmailLink value={row.blockedEmail} />}
          />
          <DetailRow
            label="Blocked At"
            value={new Date(row.blockedAt).toLocaleString()}
          />
          <DetailRow label="Reason" value={row.reason} />
        </dl>
      )}
    </Drawer>
  );
}
