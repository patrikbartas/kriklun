import Wordmark from "@/components/Wordmark";

export const metadata = { title: "kriklún — čo to je" };

const MAIL = "kriklun@kriklun.com";
const REPO = "https://github.com/patrikbartas/kriklun";

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      style={{ color: "var(--fg)", textDecoration: "underline", textUnderlineOffset: 3 }}
    >
      {children}
    </a>
  );
}

function Dot({ c, hollow }: { c: string; hollow?: boolean }) {
  return (
    <span
      aria-hidden
      className="mr-1 inline-block h-[9px] w-[9px] rounded-full align-middle"
      style={hollow ? { border: `2px solid ${c}` } : { background: c }}
    />
  );
}

export default function Info() {
  return (
    <>
      <Wordmark />

      <div className="space-y-6">
        <p>Miesto, kde napíšeš, že je niečo pokazené — a niekto ti na to odpovie.</p>

        <section>
          <p className="text-dim">prečo</p>
          <p className="mt-1">
            Doteraz sa to riešilo tak, že si to buď nepovedal nikomu, alebo si to
            napísal na Facebook o polnoci, alebo si to nasprejoval na stenu.
            Prvé nefunguje. Druhé zanikne do troch dní. Tretie naštve susedov.
          </p>
        </section>

        <section>
          <p className="text-dim">ako</p>
          <ol className="mt-1 space-y-1">
            <li>1. Odfotíš to.</li>
            <li>2. Napíšeš, čo je zle.</li>
            <li>3. Odošleš.</li>
          </ol>
          <p className="mt-3">
            Potom v <span style={{ color: "var(--fg)" }}>moje</span> vidíš, čo sa
            s tým deje. To je celý vtip: nejde o opravu, ide o odpoveď. Oprava
            trvá týždne a závisí od peňazí a dielov. Odpoveď trvá tri sekundy.
          </p>
        </section>

        <section>
          <p className="text-dim">čo znamenajú farby</p>
          <ul className="mt-1 space-y-1">
            <li><Dot c="var(--s-nahlasene)" /> nahlásené — nikto to zatiaľ nevzal</li>
            <li><Dot c="var(--s-vidime)" hollow /> vidíme to — vieme o tom</li>
            <li><Dot c="var(--s-riesi)" /> rieši sa — je na tom človek</li>
            <li><Dot c="var(--s-nejde)" /> teraz to nejde — aj s dôvodom, prečo</li>
            <li><Dot c="var(--s-hotove)" /> hotové</li>
          </ul>
        </section>

        <section>
          <p className="text-dim">aj mňa</p>
          <p className="mt-1">
            Keď máš ten istý problém, klikni <span style={{ color: "var(--fg)" }}>aj mňa</span>.
            Nie je to páčik. Je to informácia o tom, čo poschodie páli najviac,
            aby sa vedelo, čo riešiť skôr.
          </p>
        </section>

        <section>
          <p className="text-dim">zvonček</p>
          <p className="mt-1">
            Zvonček pri hlásení znamená „daj mi vedieť, keď sa s tým niečo stane“.
            Napíšeš mail raz, prehliadač si ho zapamätá, a keď sa stav zmení,
            príde ti o tom správa. Žiadny účet, žiadne heslo.
          </p>
          <p className="mt-2">
            Ak necháš mail aj pri nahlasovaní, svoju vlastnú vec sleduješ
            automaticky. Odhlásiť sa dá jedným klikom priamo z tej správy.
          </p>
        </section>

        <section>
          <p className="text-dim">zatiaľ len naša chodba</p>
          <p className="mt-1">
            Kriklún beží zatiaľ len pre 2NP. Je nás tu jedenásť ateliérov a zóny,
            z ktorých si vyberáš pri hlásení, sú len tie naše — naša chodba, naše
            WC, naše schodiská. Inde v budove zatiaľ nič nesedí.
          </p>
          <p className="mt-2">
            Vzniklo to tu a zámerne zdola. Nečakali sme, kým to niekto zavedie pre
            celú budovu — skúsili sme to na jednej chodbe, kde sa všetci poznáme.
            Ak sa to u nás osvedčí, pridať ďalšie poschodie alebo priestor je jeden
            riadok kódu. Ale najprv to musí fungovať tu.
          </p>
        </section>

        <section>
          <p className="text-dim">ako sa tu správame</p>
          <p className="mt-1">
            Píš o veciach a miestach, nie o ľuďoch. Rozbité dvere sú problém,
            sused nie.
          </p>
          <p className="mt-2">Nesprejuj na stenu. Vykrič to sem — tu sa to dá aj zmazať.</p>
          <p className="mt-2">
            Toto nie je miesto na osobné spory ani na účtovanie s nadáciou.
          </p>
          <p className="mt-2">
            A keď ti niekto odpovie, je to dobrá vôľa, nie záväzok. Aj{" "}
            <span style={{ color: "var(--fg)" }}>teraz to nejde</span> je odpoveď —
            často lepšia než ticho.
          </p>
        </section>

        <section>
          <p className="text-dim">kto to vidí</p>
          <p className="mt-1">
            Hlásenia, fotky a maily vidia len ľudia z poschodia. Nie sú nikde
            verejne a nikto ich nevygúgli. Všetci sa tu poznáme.
          </p>
        </section>

        <section>
          <p className="text-dim">našiel si chybu v appke</p>
          <p className="mt-1">
            Sem patria pokazené veci v budove, nie pokazená appka. Keď sa niečo
            nenačíta alebo sa fotka neodošle, napíš na{" "}
            <A href={`mailto:${MAIL}`}>{MAIL}</A> alebo rovno založ issue na{" "}
            <A href={`${REPO}/issues`}>GitHube</A>.
          </p>
        </section>

        <section>
          <p className="text-dim">chceš sa zapojiť</p>
          <p className="mt-1">
            Celý kód je otvorený: <A href={REPO}>{REPO.replace("https://", "")}</A>.
            Nie sú v ňom žiadne hlásenia, fotky ani mailové adresy — tie žijú
            v databáze, nie v kóde.
          </p>
          <p className="mt-2">
            Sprav si fork, pošli pull request, alebo len napíš, čo by tu malo
            pribudnúť. Nemusíš vedieť programovať, dobre položená otázka je tiež
            príspevok.
          </p>
        </section>

        <section>
          <p className="text-dim">a čo toto nie je</p>
          <p className="mt-1">
            Nie je to tiesňová linka. Keď horí alebo tečie, volaj človeka, nie appku.
          </p>
        </section>
      </div>
    </>
  );
}
