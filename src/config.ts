export const AppConfig = {
  // Standard green background for all Three.js scenes
  threeBackground: 0x80ff80,
  // CSS variable fallback (kept in sync with :root --three-bg)
  threeBackgroundCssVar: '--three-bg',
};

export function resolveThreeBgFromCss(): number {
  try {
    const varName = AppConfig.threeBackgroundCssVar;
    const css = getComputedStyle(document.documentElement).getPropertyValue(varName);
    if (!css) return AppConfig.threeBackground;
    // parse #RRGGBB
    const hex = css.trim();
    if (/^#?[0-9a-fA-F]{6}$/.test(hex)) {
      const clean = hex.startsWith('#') ? hex.slice(1) : hex;
      return parseInt(clean, 16);
    }
    return AppConfig.threeBackground;
  } catch {
    return AppConfig.threeBackground;
  }
}

