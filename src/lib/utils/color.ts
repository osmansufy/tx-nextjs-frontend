/**
 * Convert a #rrggbb hex string to the HSL channel string required by CSS custom properties.
 * shadcn uses `hsl(var(--primary))` so the variable must contain "H S% L%", not a hex value.
 *
 * Returns null if the input is not a valid 6-digit hex colour.
 */
export function hexToHslChannels(hex: string): string | null {
  const clean = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-f]{6}$/i.test(clean)) return null;

  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return `0 0% ${Math.round(l * 100)}%`;
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
