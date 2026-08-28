"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CameraPixel } from "@/components/ui/pixel";

/*
  Dole je jedina vec, a je to tá hlavna: nahlasit problem. Preto je invertovana
  - jedina plocha v celej appke, kde je pozadie a text naopak. Nastenka je na
  mene v hlavicke, moje a info na ikonach vpravo hore.

  Na /nahlasit tlacidlo skryvame. Ukazovalo by na stranku, na ktorej uz stojis,
  a nad odosielacim tlacidlom formulara by sa dalo pomylit s nim.
*/
export default function Nav() {
  const path = usePathname();
  if (path.startsWith("/operator") || path.startsWith("/nahlasit")) return null;

  return (
    <div
      className="hair fixed inset-x-0 bottom-0 border-t bg-bg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-lg px-4 py-3">
        <Link
          href="/nahlasit"
          className="flex items-center justify-center gap-3 py-4 active:opacity-80"
          style={{ background: "var(--fg)", color: "var(--bg)" }}
        >
          <CameraPixel size={26} />
          <span style={{ fontSize: 15, letterSpacing: "0.01em" }}>
            nahlásiť problém
          </span>
        </Link>
      </div>
    </div>
  );
}
