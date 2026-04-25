"use client";

import { Drawer, Select, Textarea, TextInput } from "@/components/ui";
import { COUNTRY_OPTIONS } from "@/types/country.types";
import { COMPANY } from "@/types/company.types";
import { TIMEZONE_OPTIONS } from "@/types/timezone.types";

type CompanyDrawerMode = "create" | "edit";

type CompanyDrawerProps = {
  company: COMPANY;
  initialCompany: COMPANY;
  isOpen: boolean;
  mode: CompanyDrawerMode;
  onCancel: () => void;
  onChange: (field: keyof COMPANY, value: string) => void;
  onReset: () => void;
  onSave: () => void;
};

const inputClassName =
  "h-10 rounded border bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-slate-200 dark:focus:border-indigo-400";

export function CompanyDrawer({
  company,
  initialCompany,
  isOpen,
  mode,
  onCancel,
  onChange,
  onReset,
  onSave,
}: CompanyDrawerProps) {
  const title = mode === "create" ? "Create Company" : "Edit Company";
  const subtitle =
    mode === "create"
      ? "Add a company record"
      : `${initialCompany.name} (${initialCompany.symbol})`;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onCancel}
      direction="right"
      size="min(720px, 100vw)"
      header={
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
      }
      footer={
        <div className="flex flex-col gap-2 bg-white px-5 py-4 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="cursor-pointer rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            Save
          </button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="Company Symbol"
          value={company.symbol}
          onChange={(event) => onChange("symbol", event.target.value)}
          className={inputClassName}
        />
        <TextInput
          label="Company Name"
          value={company.name}
          onChange={(event) => onChange("name", event.target.value)}
          className={inputClassName}
        />
        <Select
          label="Time Zone"
          value={company.timezone}
          onChange={(value) => onChange("timezone", String(value))}
          options={TIMEZONE_OPTIONS}
          className="h-10 rounded text-sm"
        />
        <Select
          label="Country"
          value={company.country}
          onChange={(value) => onChange("country", String(value))}
          options={COUNTRY_OPTIONS}
          className="h-10 rounded text-sm"
        />
        <Textarea
          label="Description"
          value={company.description}
          onChange={(event) => onChange("description", event.target.value)}
          rows={4}
          wrapperClassName="md:col-span-2"
          className="rounded border bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-slate-200 dark:focus:border-indigo-400"
        />
        <TextInput
          label="Estimated Market Cap"
          value={company.estimatedMarketCap}
          onChange={(event) =>
            onChange("estimatedMarketCap", event.target.value)
          }
          className={inputClassName}
        />
        <TextInput
          label="Primary Venue"
          value={company.primaryVenue}
          onChange={(event) => onChange("primaryVenue", event.target.value)}
          className={inputClassName}
        />
        <TextInput
          label="City"
          value={company.city}
          onChange={(event) => onChange("city", event.target.value)}
          className={inputClassName}
        />
        <TextInput
          label="State"
          value={company.state}
          onChange={(event) => onChange("state", event.target.value)}
          className={inputClassName}
        />
        <TextInput
          label="Website"
          value={company.website}
          onChange={(event) => onChange("website", event.target.value)}
          className={inputClassName}
        />
        <TextInput
          label="X (Twitter handle)"
          value={company.twitterHandle}
          onChange={(event) => onChange("twitterHandle", event.target.value)}
          className={inputClassName}
        />
        <TextInput
          label="Zip"
          value={company.zip}
          onChange={(event) => onChange("zip", event.target.value)}
          className={inputClassName}
        />
      </div>
    </Drawer>
  );
}
