"use client";

import { useState } from "react";
import Wordmark from "@/components/Wordmark";
import ReportCard from "@/components/ReportCard";
import { useReports } from "@/lib/useReports";
import { OPEN_STATUSES } from "@/lib/types";
import { isExpired } from "@/lib/time";

type Filter = "vsetko" | "problem" | "oznam";

export default function Nastenka() {
  const { rows, err, replace, remove } = useReports();
  const [filter, setFilter] = useState<Filter>("vsetko");
  const [showDone, setShowDone] = useState(false);

  const list = (rows ?? []).filter((r) => {
    if (r.kind === "oznam" && isExpired(r.expires_at)) return false;
    if (filter !== "vsetko" && r.kind !== filter) return false;
    if (r.kind === "problem" && !showDone && !OPEN_STATUSES.includes(r.status))
      return false;
    return true;
  });

  const open = (rows ?? []).filter(
    (r) => r.kind === "problem" && OPEN_STATUSES.includes(r.status),
  ).length;

  return (
    <>
      <Wordmark sub="Krič sem, nie na stenu." />

      <div className="mb-4 flex items-center gap-4">
        {(["vsetko", "problem", "oznam"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ color: filter === f ? "var(--fg)" : "var(--dim)" }}
          >
            <span
              style={{
                borderBottom:
                  filter === f ? "1px solid var(--fg)" : "1px solid transparent",
                paddingBottom: 2,
              }}
            >
              {f === "vsetko" ? "všetko" : f === "problem" ? "problémy" : "oznamy"}
            </span>
          </button>
        ))}
        <button
          onClick={() => setShowDone((v) => !v)}
          className="ml-auto text-dim"
        >
          {showDone ? "skryť hotové" : "aj hotové"}
        </button>
      </div>

      <p className="mb-6 text-dim">{open} otvorených</p>

      {err && <p style={{ color: "var(--s-nahlasene)" }}>{err}</p>}
      {rows === null && !err && <p className="text-dim">…</p>}
      {rows !== null && list.length === 0 && (
        <p className="hair border-t py-6 text-dim">nič tu nie je. zatiaľ ticho.</p>
      )}

      {list.map((r) => (
        <ReportCard key={r.id} r={r} onChange={replace} onDelete={remove} />
      ))}
    </>
  );
}
