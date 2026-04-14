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
  bentonCurrentlyHotLeadsData,
  contactTypeOptions,
  getCompanySymbol,
  getCompanySymbolOptions,
  LeadRow,
  leadOptions,
  leadTypeOptions,
  timezoneOptions,
} from "../_lib/data";

export function BentonLeads() {
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
        options: getCompanySymbolOptions(bentonCurrentlyHotLeadsData).map(
          (value) => ({
            label: value,
            value,
          }),
        ),
        render: (row) => (
          <CompanySymbolBadge
            symbol={getCompanySymbol(row.companyName)}
            index={bentonCurrentlyHotLeadsData.findIndex(
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
            index={bentonCurrentlyHotLeadsData.findIndex(
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
        title: "SVG-Lead Type",
        key: "svgLeadType",
        type: "select",
        options: leadTypeOptions.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.svgLeadType} kind="lead" />,
      },
      {
        title: "SVG-To be Called by",
        key: "svgToBeCalledBy",
        type: "select",
        options: assigneeOptions.map((value) => ({ label: value, value })),
      },
      {
        title: "SVG-Last Call Date",
        key: "svgLastCallDate",
        type: "date",
      },
      {
        title: "Benton-Lead Type",
        key: "bentonLeadType",
        type: "select",
        options: leadTypeOptions.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.bentonLeadType} kind="lead" />,
      },
      {
        title: "Benton-To be Called by",
        key: "bentonToBeCalledBy",
        type: "select",
        options: assigneeOptions.map((value) => ({ label: value, value })),
      },
      {
        title: "Benton-Last Call Date",
        key: "bentonLastCallDate",
        type: "date",
      },
      {
        title: "Benton-Date Become Hot",
        key: "bentonDateBecomeHot",
        type: "date",
      },
      {
        title: "Last Action Date (SVG, Benton)",
        key: "lastActionDate",
      },
    ],
    [],
  );

  return (
    <div className="min-h-full">
      <Table
        data={bentonCurrentlyHotLeadsData}
        columns={columns}
        title="Currently Hot Leads - Benton"
      />
    </div>
  );
}
