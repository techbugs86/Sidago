"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { closedContactsTabs, type ClosedContactsTabKey } from "../_lib/data";
import { ClosedContactsTable } from "./ClosedContactsTable";

function isClosedContactsTabKey(value: string | null): value is ClosedContactsTabKey {
  return closedContactsTabs.some((tab) => tab.key === value);
}

export function ClosedContacts() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: ClosedContactsTabKey = isClosedContactsTabKey(tabParam)
    ? tabParam
    : "svg-current";

  const activeView = useMemo(
    () =>
      closedContactsTabs.find((tab) => tab.key === activeTab) ??
      closedContactsTabs[0],
    [activeTab],
  );

  const updateTab = (tabKey: ClosedContactsTabKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabKey);
    params.delete("lead");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full px-4 py-2 gap-2 border-b border-slate-200/80 bg-white/75 backdrop-blur-md transition-colors dark:border-slate-600 dark:bg-slate-950/70">
          {closedContactsTabs.map((tab) => {
            const isActive = tab.key === activeView.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => updateTab(tab.key)}
                className={clsx(
                  "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition cursor-pointer",
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-200 dark:hover:text-slate-900",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <ClosedContactsTable
        data={activeView.data}
        tabKey={activeView.key}
        title={activeView.title}
      />
    </div>
  );
}
