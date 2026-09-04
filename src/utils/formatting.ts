export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatHectares(ha: number): string {
  return `${ha.toFixed(2)} Ha`;
}

export function formatPercent(pct: number): string {
  return `${pct.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function formatDays(days: number): string {
  return `${days} days`;
}
