"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  AKTIVNE,
  BUILDINGS,
  VIEWS,
  type BuildingId,
  type Level,
  type Point,
  type View,
} from "@/lib/kampus";

export type SlabKey = `${BuildingId}:${number}`;

/*
  Farba tu neexistuje. Globals.css hovori, ze farbu nesie jedine stav hlasenia,
  a model nie je stav - tak je cely v tom, co uz appka ma: papier, seda, atrament.
  Aktivne podlazie je plny atrament, zvysok bleda seda. V tmavom mode sa role
  vymenia. Ked raz budu podlazia farbit podla poctu hlaseni, bude to sila toho
  isteho atramentu, nie novy odtien.

  Ziadne obrysove ciary a ziadna medzera. Dosky sedia jedna na druhej na doraz,
  takze v pokoji je budova jedna suvisla hmota - ziadne svetielka, ziadne spary,
  nic, co by pripominalo vykres. Podlazie sa objavi az vtedy, ked nan clovek
  nabehne, a zase zmizne. To je jediny pohyb, ktory tu je.
*/
type Palette = {
  fill: string;
  hover: string;
  active: string;
  ctx: string;
};

const LIGHT: Palette = {
  fill: "#dedede",
  hover: "#bcbcbc",
  active: "#101010",
  ctx: "#ececec",
};

const DARK: Palette = {
  fill: "#3d3d3d",
  hover: "#5c5c5c",
  active: "#ededed",
  ctx: "#202020",
};

const UP = new THREE.Vector3(0, 1, 0);

// Pohlad od juhovychodu, teda od vstupu - to je uhol tvojej axonometrie.
// Na jednu budovu nizsie (citaju sa vrstvy), na cely kampus vyssie
// (citaju sa polohy budov, vrstvy tam aj tak nikto nepocita).
const DIR_BUDOVA = new THREE.Vector3(0.62, 0.48, 0.62).normalize();
const DIR_KAMPUS = new THREE.Vector3(0.55, 0.85, 0.55).normalize();

// Vsetky vrcholy, nie len rohy obalu. Skola je kriz - jej opisany kvader je
// z velkej casti prazdny, a ramovat podla neho by znamenalo nechat okolo
// modelu pas prazdna, ktory tam nikto nechce.
function pointsFor(ids: BuildingId[]) {
  const pts: THREE.Vector3[] = [];
  for (const b of BUILDINGS) {
    if (!ids.includes(b.id)) continue;
    for (const l of b.levels) {
      for (const [x, y] of l.outline) {
        pts.push(new THREE.Vector3(x, l.base, -y));
        pts.push(new THREE.Vector3(x, l.base + l.height, -y));
      }
    }
  }
  return pts;
}

function fit(pts: THREE.Vector3[], dir: THREE.Vector3, w: number, h: number) {
  const box = new THREE.Box3().setFromPoints(pts);
  const center = box.getCenter(new THREE.Vector3());
  const radius = box.getBoundingSphere(new THREE.Sphere()).radius || 1;
  const right = new THREE.Vector3().crossVectors(dir, UP).normalize();
  const up = new THREE.Vector3().crossVectors(right, dir).normalize();

  let ex = 0.001;
  let ey = 0.001;
  const c = new THREE.Vector3();
  for (const p of pts) {
    c.copy(p).sub(center);
    ex = Math.max(ex, Math.abs(c.dot(right)));
    ey = Math.max(ey, Math.abs(c.dot(up)));
  }

  return {
    position: center.clone().addScaledVector(dir, radius * 4),
    target: center,
    zoom: Math.min(w / (2 * ex), h / (2 * ey)) * 0.92,
  };
}

type Anim = {
  start: number;
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
  fromTgt: THREE.Vector3;
  toTgt: THREE.Vector3;
  fromZoom: number;
  toZoom: number;
};

/*
  Kamera a ovladanie v jednom komponente, lebo prelet potrebuje oboje naraz.
  Prepnutie pohladu preletí (~500 ms) - to je jediné, co s placatostou kampusu
  realne pomaha: kazdy stav dostane uhol, v ktorom dava zmysel.
  Preramovanie na resize zamerne nerobime: na mobile sa pri scrollovani schova
  adresny riadok, vyska sa zmeni a model by uzivatelovi vyskocil z ruky.
*/
function Rig({
  view,
  nonce,
  pts,
}: {
  view: View;
  nonce: number;
  pts: THREE.Vector3[];
}) {
  // Kameru a platno beriem cez get() az vtedy, ked ich naozaj potrebujem.
  // Zachytit si ich do premennej pri rendere by znamenalo mutovat hodnotu
  // z hooku po rendere - a to je presne to, co react-hooks/refs zakazuje.
  const get = useThree((s) => s.get);
  const invalidate = useThree((s) => s.invalidate);
  // Rozmer platna je reaktivny zamerne: prve zaramovanie sa casto nestihne,
  // lebo platno este nema rozmer, a musi sa zopakovat, ked ho dostane.
  const size = useThree((s) => s.size);
  const controls = useRef<OrbitControls | null>(null);
  const anim = useRef<Anim | null>(null);
  // Posledny zaramovany pohlad. null znamena, ze este ziadny neprebehol.
  const done = useRef<string | null>(null);

  useEffect(() => {
    const { camera, gl } = get();
    const c = new OrbitControls(camera, gl.domElement);
    c.enableDamping = true;
    c.dampingFactor = 0.14;
    c.zoomSpeed = 0.8;
    c.minZoom = 0.6;
    c.maxZoom = 200;
    // Pod teren nepustime. Model nema podlahu, zdola by to bola diera.
    c.minPolarAngle = 0.12;
    c.maxPolarAngle = Math.PI / 2 - 0.03;
    const redraw = () => invalidate();
    c.addEventListener("change", redraw);
    controls.current = c;
    return () => {
      c.removeEventListener("change", redraw);
      c.dispose();
      controls.current = null;
    };
  }, [get, invalidate]);

  useEffect(() => {
    const { camera } = get();
    const cam = camera as THREE.OrthographicCamera;
    const c = controls.current;
    if (!c) return;

    // Bez rozmeru sa ramovat neda - efekt sa zopakuje, ked rozmer pride.
    if (!size.width || !size.height) return;

    const key = `${view}:${nonce}`;
    if (done.current === key) return; // zmenil sa len rozmer, nepreramuj

    const to = fit(
      pts,
      view === "kampus" ? DIR_KAMPUS : DIR_BUDOVA,
      size.width,
      size.height,
    );
    if (!Number.isFinite(to.zoom) || to.zoom <= 0) return;

    const firstEver = done.current === null;
    done.current = key;
    cam.near = 0.1;
    cam.far = to.position.distanceTo(to.target) * 3;

    if (firstEver) {
      cam.position.copy(to.position);
      c.target.copy(to.target);
      cam.zoom = to.zoom;
      cam.updateProjectionMatrix();
      invalidate();
      return;
    }

    anim.current = {
      start: performance.now(),
      fromPos: cam.position.clone(),
      toPos: to.position,
      fromTgt: c.target.clone(),
      toTgt: to.target,
      fromZoom: cam.zoom,
      toZoom: to.zoom,
    };
    invalidate();
  }, [view, nonce, pts, size, get, invalidate]);

  useFrame((state) => {
    const c = controls.current;
    if (!c) return;
    const a = anim.current;

    if (a) {
      const t = Math.min(1, (performance.now() - a.start) / 500);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const cam = state.camera as THREE.OrthographicCamera;
      cam.position.lerpVectors(a.fromPos, a.toPos, e);
      c.target.lerpVectors(a.fromTgt, a.toTgt, e);
      cam.zoom = a.fromZoom + (a.toZoom - a.fromZoom) * e;
      cam.updateProjectionMatrix();
      if (t >= 1) anim.current = null;
      invalidate();
      // Pocas preletu controls neaktualizujeme, inak by si dopocitali polohu
      // z vlastnej gule a prelet by si prekazali.
      return;
    }

    c.update();
  });

  return null;
}

/*
  Geometria sa vyraba raz a zije v module. Dva dovody: prepnutie pohladu
  odmontuje dosky a pri navrate by sa stavali odznova, a hlavne - disposovat
  ju v cleanupe komponentu sa neda. React v dev-e efekty pusta dvakrat
  (setup - cleanup - setup), takze by sa uvolnila este za behu a model by
  zostal cierny. Je to 27 malych geometrii, drzat ich do konca stranky je
  lacnejsie nez to strazit.
*/
const CACHE = new Map<string, THREE.ExtrudeGeometry>();

function slabGeometry(outline: readonly Point[], height: number) {
  const key = `${height}|${outline.map((p) => p.join(",")).join(";")}`;
  const hit = CACHE.get(key);
  if (hit) return hit;

  const shape = new THREE.Shape();
  outline.forEach(([x, y], i) =>
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y),
  );
  shape.closePath();
  const solid = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
  });
  // Podorys lezi v XY, tak ho polozime: podorysne Y ide dole ako -Z.
  solid.rotateX(-Math.PI / 2);
  CACHE.set(key, solid);
  return solid;
}

type Tone = "fill" | "hover" | "active" | "ctx";

function Slab({
  level,
  tone,
  palette,
  onEnter,
  onLeave,
  onPick,
}: {
  level: Level;
  tone: Tone;
  palette: Palette;
  onEnter?: () => void;
  onLeave?: () => void;
  onPick?: () => void;
}) {
  const solid = slabGeometry(level.outline, level.height);
  const color =
    tone === "active"
      ? palette.active
      : tone === "hover"
        ? palette.hover
        : tone === "ctx"
          ? palette.ctx
          : palette.fill;

  const stop = (e: ThreeEvent<PointerEvent>, fn?: () => void) => {
    if (!fn) return;
    e.stopPropagation();
    fn();
  };

  return (
    <group position={[0, level.base, 0]}>
      <mesh
        geometry={solid}
        onPointerOver={onEnter ? (e) => stop(e, onEnter) : undefined}
        onPointerOut={onLeave ? () => onLeave() : undefined}
        onPointerDown={onPick ? (e) => stop(e, onPick) : undefined}
      >
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  );
}

function Scene({
  view,
  nonce,
  palette,
  hovered,
  selected,
  onHover,
  onSelect,
}: {
  view: View;
  nonce: number;
  palette: Palette;
  hovered: SlabKey | null;
  selected: SlabKey | null;
  onHover: (k: SlabKey | null) => void;
  onSelect: (k: SlabKey | null) => void;
}) {
  const shows = useMemo(() => VIEWS.find((v) => v.id === view)!.shows, [view]);
  const pts = useMemo(() => pointsFor(shows), [shows]);

  return (
    <>
      {/*
        Intenzity vyzeraju vysoko, ale three deli difuzny prispevok cez pi
        (BRDF_Lambert = albedo / pi). Vysledok: strecha vyjde presne na plnu
        farbu materialu, bocne steny na ~0,83 a odvratene na ~0,70 - teda ta
        istá gradacia, aku ma tvoja axonometria zo SketchUpu.
      */}
      <ambientLight intensity={2.2} />
      <directionalLight position={[60, 120, 45]} intensity={1.15} />
      <Rig view={view} nonce={nonce} pts={pts} />

      {BUILDINGS.filter((b) => shows.includes(b.id)).map((b) =>
        b.levels.map((l) => {
          const key: SlabKey = `${b.id}:${l.n}`;
          // Interaktivna je len skola - jedina budova, na ktoru dnes ukazuju
          // zony. Internat a krcok sa daju obzriet, ale nereaguju, lebo za
          // nimi nic nie je.
          const live = b.id === "skola";
          const isActive =
            b.id === AKTIVNE.building && l.n === AKTIVNE.level;
          const tone: Tone = isActive
            ? "active"
            : key === hovered || key === selected
              ? "hover"
              : view === "kampus" && b.id !== "skola"
                ? "ctx"
                : "fill";

          return (
            <Slab
              key={key}
              level={l}
              tone={tone}
              palette={palette}
              onEnter={live ? () => onHover(key) : undefined}
              onLeave={live ? () => onHover(null) : undefined}
              onPick={live ? () => onSelect(key) : undefined}
            />
          );
        }),
      )}
    </>
  );
}

export default function Model({
  view,
  nonce,
  dark,
  hovered,
  selected,
  onHover,
  onSelect,
}: {
  view: View;
  nonce: number;
  dark: boolean;
  hovered: SlabKey | null;
  selected: SlabKey | null;
  onHover: (k: SlabKey | null) => void;
  onSelect: (k: SlabKey | null) => void;
}) {
  /*
    R3F namountuje scenu az vtedy, ked mu react-use-measure ohlasi nenulovy
    rozmer platna. Lenze ten hook prve meranie zahodi, ak ResizeObserver
    stihne zavolat skor, nez si nastavi svoj "mounted" priznak - a druhy raz
    uz nezavola, lebo sa rozmer nezmenil. Vysledok je prazdny ram a ziadna
    chyba v konzole.

    Synteticke resize to dorovna: na window resize ten hook pocuva tiez a
    vtedy uz je namountovany. Posielame ho hned (efekt bezi az po efektoch
    detí, takze Canvas uz svoj listener ma) a este raz cez timeout, keby prve
    meranie prislo az po nom. Ziadny requestAnimationFrame - v neaktivnej
    karte nebezi a stranka otvorena na pozadi by ostala prazdna.
  */
  useEffect(() => {
    const nudge = () => window.dispatchEvent(new Event("resize"));
    nudge();
    const id = setTimeout(nudge, 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <Canvas
      orthographic
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [100, 80, 100], zoom: 5, near: 0.1, far: 3000 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
      resize={{ scroll: false, debounce: { scroll: 50, resize: 16 } }}
      onPointerMissed={() => onSelect(null)}
      style={{ touchAction: "none" }}
    >
      <Scene
        view={view}
        nonce={nonce}
        palette={dark ? DARK : LIGHT}
        hovered={hovered}
        selected={selected}
        onHover={onHover}
        onSelect={onSelect}
      />
    </Canvas>
  );
}
