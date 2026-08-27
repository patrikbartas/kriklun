import Link from "next/link";
import { WrenchIcon } from "@/components/ui/wrench";

// Klucik je easter egg: vedie na /info. Text vedie domov.
export default function Wordmark({
  claim = false,
  suffix,
}: {
  claim?: boolean;
  suffix?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <Link href="/info" aria-label="info" className="shrink-0 active:opacity-60">
          <WrenchIcon size={20} />
        </Link>
        <Link href="/" className="pixel leading-none active:opacity-60">
          KRIKLUN
        </Link>
        {suffix && <span className="pixel leading-none text-dim">{suffix}</span>}
      </div>
      {claim && <div className="mt-2 text-dim">Krič sem, nie na stenu.</div>}
    </div>
  );
}
