"use client";

import { useCallback, useEffect, useState } from "react";
import type { Report } from "./types";

export function useReports() {
  const [rows, setRows] = useState<Report[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/reports", { cache: "no-store" });
      if (!res.ok) throw new Error((await res.json()).error ?? "chyba");
      setRows(await res.json());
    } catch (e) {
      setErr(String(e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const replace = useCallback((r: Report) => {
    setRows((prev) => prev?.map((x) => (x.id === r.id ? r : x)) ?? prev);
  }, []);

  const remove = useCallback((id: string) => {
    setRows((prev) => prev?.filter((x) => x.id !== id) ?? prev);
  }, []);

  return { rows, err, reload: load, replace, remove };
}
