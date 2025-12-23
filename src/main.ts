import { renderRoutes } from "./routes";
import { initTheme, toggleTheme } from "./lib/theme";
import "./styles/main.scss";
const BASE = import.meta.env.BASE_URL || "/";

initTheme();

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  toggleTheme();
});

renderRoutes(location.pathname);

window.addEventListener('popstate', () => {
  renderRoutes(location.pathname);
  console.log(location.pathname);
});

document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest('a[data-link]');
  if (link) {
    e.preventDefault();
    let href = link.getAttribute('href')!;
    if (!href.startsWith(BASE)) {
      if (href.startsWith('/')) href = href.replace('/', BASE);
      else href = BASE + href;
    }
    history.pushState(null, '', href);
    renderRoutes(href);
  }
});
