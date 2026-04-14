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
  svgCurrentlyHotLeadsData,
  timezoneOptions,
} from "../_lib/data";

export function SVGLeads() {
  const columns = useMemo<Column<LeadRow>[]>(
    () => [
      {
        title: "lead",
        key: "lead",
        type: "select",
        options: leadOptions.map((value) => ({ label: value, value })),
      },
      {
        title: "company symbol",
        key: "companySymbol",
        getValue: (row) => getCompanySymbol(row.companyName),
        type: "select",
        options: getCompanySymbolOptions(svgCurrentlyHotLeadsData).map(
          (value) => ({
            label: value,
            value,
          }),
        ),
        render: (row) => (
          <CompanySymbolBadge
            symbol={getCompanySymbol(row.companyName)}
            index={svgCurrentlyHotLeadsData.findIndex(
              (item) => item.email === row.email,
            )}
          />
        ),
      },
      { title: "company name", key: "companyName" },
      { title: "full name", key: "fullName" },
      { title: "phone", key: "phone" },
      { title: "email", key: "email" },
      {
        title: "timezone",
        key: "timezone",
        type: "select",
        options: timezoneOptions.map((value) => ({
          label: value,
          value,
        })),
        render: (row) => (
          <TimezoneBadge
            timezone={row.timezone}
            index={svgCurrentlyHotLeadsData.findIndex(
              (item) => item.email === row.email,
            )}
          />
        ),
      },
      {
        title: "contact type",
        key: "contactType",
        type: "select",
        options: contactTypeOptions.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.contactType} kind="contact" />,
      },
      {
        title: "SVG-lead type",
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
        title: "SVG-last call date",
        key: "svgLastCallDate",
        type: "date",
      },
      {
        title: "Benton-lead type",
        key: "bentonLeadType",
        type: "select",
        options: leadTypeOptions.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.bentonLeadType} kind="lead" />,
      },
      {
        title: "Benton -to be called by",
        key: "bentonToBeCalledBy",
        type: "select",
        options: assigneeOptions.map((value) => ({ label: value, value })),
      },
      {
        title: "date become hot",
        key: "svgDateBecomeHot",
        type: "date",
      },
      {
        title: "last action date (SVG,BENton)",
        key: "lastActionDate",
      },
    ],
    [],
  );

  return (
    <div className="min-h-full">
      <Table
        data={svgCurrentlyHotLeadsData}
        columns={columns}
        title="Currently Hot Leads - SVG"
      />
    </div>
  );
}
