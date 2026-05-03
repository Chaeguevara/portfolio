import { renderRoutes, navigate } from "./routes";
import { initTheme, toggleTheme } from "./lib/theme";
import { initInProgressDropdown } from "./lib/inProgress";
import "./styles/main.scss";

initTheme();
initInProgressDropdown();

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  toggleTheme();
});

// Initial route render
renderRoutes(location.pathname + location.search);

// Browser back/forward
window.addEventListener('popstate', () => {
  renderRoutes(location.pathname + location.search);
});

// SPA link interception
document.addEventListener('click', (e) => {
  // Skip if modifier key (open in new tab/window) or non-primary button
  const me = e as MouseEvent;
  if (me.metaKey || me.ctrlKey || me.shiftKey || me.altKey || me.button !== 0) return;

  const link = (e.target as HTMLElement).closest('a[data-link]') as HTMLAnchorElement | null;
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href) return;
  e.preventDefault();
  navigate(href);
});
