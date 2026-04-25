"use client";

import { CompanySymbolBadge, Table, TimezoneBadge } from "@/components/ui";
import { Column } from "@/components/ui/Table";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { COUNTRY_OPTIONS } from "@/types/country.types";
import { COMPANY, COMPANY_VALUES } from "@/types/company.types";
import { TIMEZONE_OPTIONS } from "@/types/timezone.types";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { CompanyDrawer } from "./CompanyDrawer";

const blankCompany: COMPANY = {
  symbol: "",
  name: "",
  timezone: "1-EST",
  country: "United States",
  description: "",
  estimatedMarketCap: "",
  primaryVenue: "",
  city: "",
  state: "",
  website: "",
  twitterHandle: "",
  zip: "",
};

type DrawerMode = "create" | "edit";

type DrawerState = {
  isOpen: boolean;
  mode: DrawerMode;
  originalSymbol: string | null;
  initialCompany: COMPANY;
  draft: COMPANY;
};

function normalizeSymbol(value: string) {
  return value.trim().toUpperCase();
}

function normalizeCompany(company: COMPANY): COMPANY {
  return {
    ...company,
    symbol: normalizeSymbol(company.symbol),
    name: company.name.trim(),
    website: company.website.trim(),
    twitterHandle: company.twitterHandle.trim(),
    zip: company.zip.trim(),
  };
}

export function Companies() {
  const [companies, setCompanies] = useState<COMPANY[]>(COMPANY_VALUES);
  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: false,
    mode: "create",
    originalSymbol: null,
    initialCompany: blankCompany,
    draft: blankCompany,
  });

  const columns = useMemo<Column<COMPANY>[]>(
    () => [
      {
        title: "Company Symbol",
        key: "symbol",
        render: (row) => (
          <CompanySymbolBadge
            symbol={row.symbol}
            index={companies.findIndex((company) => company.symbol === row.symbol)}
          />
        ),
      },
      { title: "Company Name", key: "name" },
      {
        title: "Time Zone",
        key: "timezone",
        type: "select",
        options: TIMEZONE_OPTIONS,
        render: (row) => (
          <TimezoneBadge
            timezone={row.timezone}
            index={companies.findIndex((company) => company.symbol === row.symbol)}
          />
        ),
      },
      {
        title: "Country",
        key: "country",
        type: "select",
        options: COUNTRY_OPTIONS,
      },
      { title: "Description", key: "description" },
      { title: "Estimated Market Cap", key: "estimatedMarketCap" },
      { title: "Primary Venue", key: "primaryVenue" },
      { title: "City", key: "city" },
      { title: "State", key: "state" },
      {
        title: "Website",
        key: "website",
        render: (row) =>
          row.website ? (
            <a
              href={row.website}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
              onClick={(event) => event.stopPropagation()}
            >
              {row.website}
            </a>
          ) : (
            ""
          ),
      },
      { title: "X (Twitter handle)", key: "twitterHandle" },
      { title: "Zip", key: "zip" },
    ],
    [companies],
  );

  const openCreateDrawer = () => {
    setDrawerState({
      isOpen: true,
      mode: "create",
      originalSymbol: null,
      initialCompany: blankCompany,
      draft: blankCompany,
    });
  };

  const openEditDrawer = (company: COMPANY) => {
    const nextCompany = { ...company };

    setDrawerState({
      isOpen: true,
      mode: "edit",
      originalSymbol: company.symbol,
      initialCompany: nextCompany,
      draft: nextCompany,
    });
  };

  const closeDrawer = () => {
    setDrawerState((current) => ({ ...current, isOpen: false }));
  };

  const updateDraft = (field: keyof COMPANY, value: string) => {
    setDrawerState((current) => ({
      ...current,
      draft: {
        ...current.draft,
        [field]: value,
      },
    }));
  };

  const resetDraft = () => {
    setDrawerState((current) => ({
      ...current,
      draft: { ...current.initialCompany },
    }));
  };

  const saveCompany = () => {
    const nextCompany = normalizeCompany(drawerState.draft);

    if (!nextCompany.symbol || !nextCompany.name) {
      showErrorToast(new Error("Company symbol and company name are required."));
      return;
    }

    setCompanies((current) =>
      drawerState.mode === "create"
        ? [...current, nextCompany]
        : current.map((company) =>
            company.symbol === drawerState.originalSymbol
              ? nextCompany
              : company,
          ),
    );
    showSuccessToast(
      drawerState.mode === "create"
        ? "Company created successfully."
        : "Company updated successfully.",
    );
    setDrawerState((current) => ({
      ...current,
      mode: "edit",
      originalSymbol: nextCompany.symbol,
      initialCompany: nextCompany,
      draft: nextCompany,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end px-4 mt-3">
        <button
          type="button"
          onClick={openCreateDrawer}
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          <Plus size={16} />
          Add Company
        </button>
      </div>

      <Table
        data={companies}
        columns={columns}
        title="Companies"
        description="Company market and contact profile"
        onRowClick={openEditDrawer}
      />

      <CompanyDrawer
        company={drawerState.draft}
        initialCompany={drawerState.initialCompany}
        isOpen={drawerState.isOpen}
        mode={drawerState.mode}
        onCancel={closeDrawer}
        onChange={updateDraft}
        onReset={resetDraft}
        onSave={saveCompany}
      />
    </div>
  );
}
