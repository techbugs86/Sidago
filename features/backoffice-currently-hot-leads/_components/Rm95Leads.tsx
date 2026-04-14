"use client";

import {
  CompanySymbolBadge,
  TimezoneBadge,
  TypeBadge,
} from "@/components/ui";
import { Table, type Column } from "@/components/ui/Table";
import React, { useMemo } from "react";
import {
  assigneeOptions,
  contactTypeOptions,
  getCompanySymbol,
  getCompanySymbolOptions,
  LeadRow,
  leadOptions,
  leadTypeOptions,
  rm95CurrentlyHotLeadsData,
  timezoneOptions,
} from "../_lib/data";

export function Rm95Leads() {
  const columns = useMemo<Column<LeadRow>[]>(
    () => [
      {
        title: "Lead",
        key: "lead",
        type: "select",
        options: leadOptions.map((value) => ({ label: value, value })),
      },
      {
        title: "Company Symbol",
        key: "companySymbol",
        getValue: (row) => getCompanySymbol(row.companyName),
        type: "select",
        options: getCompanySymbolOptions(rm95CurrentlyHotLeadsData).map(
          (value) => ({
            label: value,
            value,
          }),
        ),
        render: (row) => (
          <CompanySymbolBadge
            symbol={getCompanySymbol(row.companyName)}
            index={rm95CurrentlyHotLeadsData.findIndex(
              (item) => item.email === row.email,
            )}
          />
        ),
      },
      { title: "Company Name", key: "companyName" },
      { title: "Full Name", key: "fullName" },
      { title: "Phone", key: "phone" },
      { title: "Email", key: "email" },
      {
        title: "Timezone",
        key: "timezone",
        type: "select",
        options: timezoneOptions.map((value) => ({
          label: value,
          value,
        })),
        render: (row) => (
          <TimezoneBadge
            timezone={row.timezone}
            index={rm95CurrentlyHotLeadsData.findIndex(
              (item) => item.email === row.email,
            )}
          />
        ),
      },
      {
        title: "Contact Type",
        key: "contactType",
        type: "select",
        options: contactTypeOptions.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.contactType} kind="contact" />,
      },
      {
        title: "95RM-Lead Type",
        key: "rm95LeadType",
        type: "select",
        options: leadTypeOptions.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.rm95LeadType} kind="lead" />,
      },
      {
        title: "95RM-To be Called by",
        key: "rm95ToBeCalledBy",
        type: "select",
        options: assigneeOptions.map((value) => ({ label: value, value })),
      },
      {
        title: "95RM-Last Call Date",
        key: "rm95LastCallDate",
        type: "date",
      },
      {
        title: "95RM-Date Become Hot",
        key: "rm95DateBecomeHot",
        type: "date",
      },
      {
        title: "Last Action Date (95RM, SVG, Benton)",
        key: "lastActionDate",
      },
    ],
    [],
  );

  return (
    <div className="min-h-full">
      <Table
        data={rm95CurrentlyHotLeadsData}
        columns={columns}
        title="Currently Hot Leads - 95RM"
      />
    </div>
  );
}
