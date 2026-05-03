import * as THREE from "three";
import { homeView } from "./pages/home";
import { workView } from "./pages/works";
import { createScene, disposeActiveScene, setActiveCleanup } from "./scene";
import { initWorksGrid } from "./pages/works";
import { disposeCardPreviews } from "./previews";
import { aboutView } from "./pages/about";
import { designerView } from "./pages/designer";
import { aboutScene } from "./models";
import { initOverlayToggle } from "./lib/overlayToggle";
import { initDesigner } from "./lib/designerEngine";

const BASE = import.meta.env.BASE_URL || "/"; // e.g. "/portfolio/" on GH Pages, "/" on Vercel root
const BASE_NO_SLASH = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;

let routeCleanup: (() => void) | null = null;

/**
 * Strip the deployment base prefix and any query/hash, returning a clean
 * route path that always starts with "/" — e.g. "/works/3", "/", "/designer".
 * Tolerates missing trailing slash ("/portfolio" → "/").
 */
function normalizePath(raw: string): string {
  let p = raw.split('?')[0].split('#')[0];
  if (BASE_NO_SLASH && p.startsWith(BASE_NO_SLASH)) {
    p = p.slice(BASE_NO_SLASH.length);
  }
  if (!p.startsWith('/')) p = '/' + p;
  // Collapse trailing slash (except root)
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

/**
 * Build a fully-prefixed URL for navigation (used by pushState consumers).
 * Accepts either absolute ("/works/3") or already-prefixed ("/portfolio/works/3").
 */
export function buildHref(routePath: string): string {
  if (routePath.startsWith(BASE)) return routePath;
  if (routePath.startsWith('/')) return BASE_NO_SLASH + routePath;
  return BASE + routePath;
}

/**
 * Programmatic navigation — pushes history state and re-renders.
 * All in-app code should call this instead of touching history directly.
 */
export function navigate(routePath: string): void {
  const href = buildHref(routePath);
  if (location.pathname + location.search === href) {
    renderRoutes(href);
    return;
  }
  history.pushState({}, '', href);
  renderRoutes(href);
}

export function renderRoutes(rawPath: string): void {
  // Always dispose previous scenes/previews/route cleanup first
  disposeActiveScene();
  disposeCardPreviews();
  if (routeCleanup) {
    try { routeCleanup(); } catch (e) { console.error('[Router] route cleanup failed', e); }
    routeCleanup = null;
  }

  const main = document.getElementById('app');
  if (!main) return;

  const path = normalizePath(rawPath);
  const segments = path.split('/').filter(Boolean); // ["works","3"] or []
  const base = segments[0] ?? '';
  const subPath = segments.slice(1).join('/');

  // Update nav active state — match by normalized route, not raw href
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.remove('active');
    a.removeAttribute('aria-current');
    const aHref = (a as HTMLAnchorElement).getAttribute('href') || '';
    if (normalizePath(aHref) === '/' + base) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  switch ('/' + base) {
    case '/':
      main.innerHTML = homeView();
      break;
    case '/works': {
      const workId = Number(subPath);
      main.innerHTML = workView(workId);
      if (workId > 0) {
        createScene(workId)();
        routeCleanup = initOverlayToggle();
      } else {
        initWorksGrid();
      }
      break;
    }
    case '/about': {
      main.innerHTML = aboutView();
      const aboutContainer = document.getElementById('about-scene');
      if (aboutContainer) {
        const cleanup = aboutScene(new THREE.Scene(), { mount: aboutContainer });
        setActiveCleanup(cleanup);
      }
      break;
    }
    case '/designer':
      main.innerHTML = designerView();
      routeCleanup = initDesigner();
      break;
    default:
      // Unknown route → fall back to home, also rewrite URL so reload doesn't 404 again
      main.innerHTML = homeView();
      history.replaceState({}, '', BASE);
      break;
  }
}

// Expose for legacy callers (works.ts grid click handler) — they should use navigate() going forward.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).renderRoutes = renderRoutes;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).navigate = navigate;
