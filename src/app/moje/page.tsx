"use client";

import { useEffect, useState } from "react";
import Wordmark from "@/components/Wordmark";
import ReportCard from "@/components/ReportCard";
import { useReports } from "@/lib/useReports";
import { getName } from "@/lib/me";

export default function Moje() {
  const { rows, replace } = useReports();
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => setMe(getName()), []);

  const mine = (rows ?? []).filter(
    (r) => me && r.author.toLowerCase() === me.toLowerCase(),
  );

  return (
    <>
      <Wordmark />
      <p className="mb-4 text-dim">
        {me ? `denníček — ${me}` : "denníček"}
      </p>

      {me === "" && (
        <p className="hair border-t py-6 text-dim">
          zatiaľ si nič nenahlásil. keď to spravíš, uvidíš tu, čo sa s tým deje.
        </p>
      )}

      {me !== "" && rows !== null && mine.length === 0 && (
        <p className="hair border-t py-6 text-dim">tu nič nemáš.</p>
      )}

      {mine.map((r) => (
        <ReportCard key={r.id} r={r} onChange={replace} />
      ))}
    </>
  );
}
