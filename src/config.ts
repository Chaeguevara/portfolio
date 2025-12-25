export const AppConfig = {
  // Standard green background for all Three.js scenes
  threeBackground: 0x0a140a, // Darker green fallback
  // CSS variable fallback (kept in sync with :root --three-bg)
  threeBackgroundCssVar: '--three-bg',
};

export function resolveThreeBgFromCss(): string | number {
  try {
    const varName = AppConfig.threeBackgroundCssVar;
    const css = getComputedStyle(document.documentElement).getPropertyValue(varName);
    if (!css) return AppConfig.threeBackground;

    // Return the string directly (e.g., "hsl(120, 15%, 12%)" or "rgb(20, 20, 20)")
    // Three.js Color constructor handles standard CSS color strings.
    const clean = css.trim();
    if (clean) return clean;

    return AppConfig.threeBackground;
  } catch {
    return AppConfig.threeBackground;
  }
}

