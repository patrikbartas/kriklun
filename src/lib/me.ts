"use client";

// Ziadny login. Meno a mail sa napisu raz a pamata si ich prehliadac.
// Prihlasovanie v chodbe by adopciu zabilo spolahlivejsie nez cokolvek ine.
const NAME = "kriklun.meno";
const PLUSED = "kriklun.plusnute";
const PIN = "kriklun.pin";
const MAIL = "kriklun.mail";
const WATCHED = "kriklun.sledujem";

export function getName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(NAME) ?? "";
}

export function setName(v: string) {
  localStorage.setItem(NAME, v.trim());
}

export function hasPlused(id: string): boolean {
  if (typeof window === "undefined") return false;
  return (JSON.parse(localStorage.getItem(PLUSED) ?? "[]") as string[]).includes(id);
}

export function markPlused(id: string) {
  const all = JSON.parse(localStorage.getItem(PLUSED) ?? "[]") as string[];
  if (!all.includes(id)) localStorage.setItem(PLUSED, JSON.stringify([...all, id]));
}

export function getPin(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(PIN) ?? "";
}

export function setPin(v: string) {
  localStorage.setItem(PIN, v);
}

export function getMail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(MAIL) ?? "";
}

export function setMail(v: string) {
  localStorage.setItem(MAIL, v.trim().toLowerCase());
}

export function isWatching(id: string): boolean {
  if (typeof window === "undefined") return false;
  return (JSON.parse(localStorage.getItem(WATCHED) ?? "[]") as string[]).includes(id);
}

export function markWatching(id: string) {
  const all = JSON.parse(localStorage.getItem(WATCHED) ?? "[]") as string[];
  if (!all.includes(id)) localStorage.setItem(WATCHED, JSON.stringify([...all, id]));
}
