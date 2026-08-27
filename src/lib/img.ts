"use client";

// Zmensi fotku z mobilu na rozumnu velkost priamo v prehliadaci.
// Bez tohto by 4 MB fotky z telefonu narazili na limit requestu.
const MAX = 1600;
const QUALITY = 0.82;

export async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas nedostupny");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", QUALITY);
}
