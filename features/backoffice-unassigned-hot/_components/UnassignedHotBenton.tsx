"use client";

import React from "react";
import { unassignedHotLeadsData } from "../_lib/data";
import { UnassignedHotTable } from "./UnassignedHotTable";

export function UnassignedHotBenton() {
  return (
    <UnassignedHotTable
      data={unassignedHotLeadsData}
      title="Unassigned Hot Leads - Benton"
      variant="benton"
    />
  );
}
