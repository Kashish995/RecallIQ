export function getRetColor(r: number) {
  return r >= 60 ? '#10B981' : r >= 40 ? '#F59E0B' : '#EF4444';
}
export function getRetClass(r: number) {
  return r >= 60 ? 'text-emerald-400' : r >= 40 ? 'text-amber-400' : 'text-red-400';
}
