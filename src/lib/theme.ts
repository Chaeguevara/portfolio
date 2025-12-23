/**
 * @fileoverview Theme management logic for Light/Dark mode.
 * Handles persistence, system preference syncing, and event dispatching.
 */

export type Theme = 'light' | 'dark';

export const THEME_KEY = 'portfolio-theme';
export const THEME_EVENT = 'theme-changed';

export function getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function getStoredTheme(): Theme | null {
    return localStorage.getItem(THEME_KEY) as Theme | null;
}

export function setTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme } }));
}

export function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') as Theme;
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
}

export function initTheme() {
    const stored = getStoredTheme();
    const system = getSystemTheme();
    const initial = stored || system;

    // Set initial without dispatching event (no need to re-render scenes yet)
    document.documentElement.setAttribute('data-theme', initial);

    // Listen for system changes if no override is set
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
            setTheme(e.matches ? 'light' : 'dark');
        }
    });
}
