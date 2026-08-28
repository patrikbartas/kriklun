import Link from "next/link";
import { KampusPixel, MePixel, WrenchPixel } from "@/components/ui/pixel";

/*
  Hlavicka: vlavo meno, ktore vedie na nastenku, vpravo tri ikony.
  Kluc uz nie je easter egg vedla loga - stoji vpravo ako otvoreny odkaz na
  /info, vedla neho kampus a uplne vpravo zajac na /moje. Dole ostava jedine
  tlacidlo, nahlasenie, tak sa ostatne cesty musia dat najst tu.

  Zajac zostava vpravo aj po pribudnuti kampusu: je to jedina z tych troch
  ikon, na ktoru clovek chodi opakovane, a pravy okraj je na telefone
  najlepsie dosiahnutelny palcom.

  Pod menom je jeden riadok, ktory povie, kde stojis - claim na nastenke,
  meno denniceka v moje, veta o com to je v info. Je to jedna a ta ista
  linajka, tak zije tu a nie na kazdej stranke zvlast. Inak sedi na kazdej
  stranke inak vysoko.
*/
export default function Wordmark({
  sub,
  suffix,
}: {
  sub?: React.ReactNode;
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
          <Link href="/kampus" aria-label="kampus" className="active:opacity-60">
            <KampusPixel size={20} />
          </Link>
          <Link href="/moje" aria-label="moje" className="active:opacity-60">
            <MePixel size={20} />
          </Link>
        </div>
      </div>
      {sub && <div className="mt-2 text-dim">{sub}</div>}
    </div>
  );
}
