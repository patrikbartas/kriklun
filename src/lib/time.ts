export function daysOpen(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

export function ageLabel(iso: string): string {
  const d = daysOpen(iso);
  if (d === 0) {
    const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
    return h < 1 ? "teraz" : `${h}h`;
  }
  return `${d}d`;
}

export function isExpired(iso: string | null): boolean {
  if (!iso) return false;
  return new Date(iso).getTime() < Date.now();
}
