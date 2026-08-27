"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import { ZONES } from "@/lib/zones";
import { fileToDataUrl } from "@/lib/img";
import { getName, setName, getMail, setMail, markWatching } from "@/lib/me";
import type { Kind } from "@/lib/types";

export default function Nahlasit() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [kind, setKind] = useState<Kind>("problem");
  const [photo, setPhoto] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [zone, setZone] = useState<string>(ZONES[0]);
  const [until, setUntil] = useState("");
  const [me, setMe] = useState("");
  const [mail, setMailInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setMe(getName());
    setMailInput(getMail());
  }, []);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(null);
    try {
      setPhoto(await fileToDataUrl(f));
    } catch {
      setErr("fotku sa nepodarilo načítať");
    }
  }

  async function send() {
    if (!me.trim()) return setErr("napíš, kto si");
    setBusy(true);
    setErr(null);
    setName(me);
    if (mail.trim()) setMail(mail);

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        text: text.trim(),
        zone,
        author: me.trim(),
        photoDataUrl: photo,
        email: mail.trim() || null,
        expiresAt: kind === "oznam" && until ? new Date(until).toISOString() : null,
      }),
    });

    setBusy(false);
    if (!res.ok) return setErr((await res.json()).error ?? "nepodarilo sa odoslať");

    // Kto nechal mail, sleduje vlastnu vec. Nech to vidi aj zvoncek na nastenke.
    if (mail.trim()) markWatching((await res.json()).id);
    router.push("/moje");
  }

  const label = kind === "oznam" ? "oznámiť" : "nahlásiť";

  return (
    <>
      <Wordmark />

      <div className="mb-5 flex gap-4">
        {(["problem", "oznam"] as Kind[]).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            style={{ color: kind === k ? "var(--fg)" : "var(--dim)" }}
          >
            <span
              style={{
                borderBottom:
                  kind === k ? "1px solid var(--fg)" : "1px solid transparent",
                paddingBottom: 2,
              }}
            >
              {k === "problem" ? "niečo je pokazené" : "chcem niečo oznámiť"}
            </span>
          </button>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={pick}
        className="hidden"
      />

      <button
        onClick={() => fileRef.current?.click()}
        className="hair mb-4 flex w-full items-center justify-center border border-dashed py-10 text-dim"
        style={{ padding: photo ? 0 : undefined }}
      >
        {photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={photo} alt="" className="w-full object-cover" style={{ maxHeight: 340 }} />
        ) : (
          <span>{kind === "oznam" ? "foto (nepovinné)" : "odfotiť"}</span>
        )}
      </button>

      {photo && (
        <button onClick={() => setPhoto(null)} className="mb-4 text-dim">
          zahodiť fotku
        </button>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder={
          kind === "oznam"
            ? "dnes vŕtam medzi 15:00 a 16:00"
            : "čo je zle (nepovinné, ak je fotka)"
        }
        className="hair mb-4 w-full border-b pb-2 placeholder:text-dim"
      />

      <select
        value={zone}
        onChange={(e) => setZone(e.target.value)}
        className="hair mb-4 w-full border-b pb-2"
      >
        {ZONES.map((z) => (
          <option key={z} value={z}>
            {z}
          </option>
        ))}
      </select>

      {kind === "oznam" && (
        <label className="hair mb-4 flex w-full items-center justify-between border-b pb-2 text-dim">
          <span >platí do</span>
          <input
            type="date"
            value={until}
            onChange={(e) => setUntil(e.target.value)}
            className="text-right"
            style={{ color: "var(--fg)" }}
          />
        </label>
      )}

      <input
        value={me}
        onChange={(e) => setMe(e.target.value)}
        placeholder="kto si"
        className="hair mb-4 w-full border-b pb-2 placeholder:text-dim"
      />

      <input
        type="email"
        inputMode="email"
        value={mail}
        onChange={(e) => setMailInput(e.target.value)}
        placeholder="mail, ak chceš vedieť o zmenách (nepovinné)"
        className="hair mb-6 w-full border-b pb-2 placeholder:text-dim"
      />

      {err && (
        <p className="mb-4" style={{ color: "var(--s-nahlasene)" }}>
          {err}
        </p>
      )}

      <button
        onClick={send}
        disabled={busy}
        className="hair w-full border py-4"
        style={{ opacity: busy ? 0.4 : 1 }}
      >
        {busy ? "…" : label}
      </button>
    </>
  );
}
