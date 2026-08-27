"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "nástenka" },
  { href: "/nahlasit", label: "pridať" },
  { href: "/moje", label: "moje" },
];

export default function Nav() {
  const path = usePathname();
  if (path.startsWith("/operator")) return null;

  return (
    <nav
      className="hair fixed inset-x-0 bottom-0 border-t bg-bg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-lg">
        {ITEMS.map((it) => {
          const active = path === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className="flex-1 py-4 text-center"
              style={{ color: active ? "var(--fg)" : "var(--dim)" }}
            >
              <span
                style={{
                  borderBottom: active ? "1px solid var(--fg)" : "1px solid transparent",
                  paddingBottom: 3,
                }}
              >
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
