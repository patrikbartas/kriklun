import Link from "next/link";
import { MePixel, WrenchPixel } from "@/components/ui/pixel";

/*
  Hlavicka: vlavo meno, ktore vedie na nastenku, vpravo dve ikony.
  Kluc uz nie je easter egg vedla loga - stoji vpravo ako otvoreny odkaz na
  /info, vedla neho zajac na /moje. Dole ostava jedine tlacidlo, nahlasenie,
  tak sa ostatne cesty musia dat najst tu.
*/
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
        <Link href="/" className="pixel leading-none active:opacity-60">
          KRIKLUN
        </Link>
        {suffix && <span className="pixel leading-none text-dim">{suffix}</span>}

        <div className="ml-auto flex shrink-0 items-center gap-4">
          <Link href="/info" aria-label="čo to je" className="active:opacity-60">
            <WrenchPixel size={20} />
          </Link>
          <Link href="/moje" aria-label="moje" className="active:opacity-60">
            <MePixel size={20} />
          </Link>
        </div>
      </div>
      {claim && <div className="mt-2 text-dim">Krič sem, nie na stenu.</div>}
    </div>
  );
}
