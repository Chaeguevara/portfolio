import * as THREE from "three";
import { homeView } from "./pages/home";
import { workView } from "./pages/works";
import { createScene, disposeActiveScene, setActiveCleanup } from "./scene";
import { initWorksGrid } from "./pages/works";
import { disposeCardPreviews } from "./previews";
import { aboutView } from "./pages/about";
import { aboutScene } from "./models";
import { initOverlayToggle } from "./lib/overlayToggle";
const BASE = import.meta.env.BASE_URL || "/";

let routeCleanup: (() => void) | null = null;

export function renderRoutes(path: string) {
  console.log(`[Router] Navigation start: ${path}`);
  // Always dispose previous scenes and previews before rendering new route
  disposeActiveScene();
  disposeCardPreviews();

  if (routeCleanup) {
    routeCleanup();
    routeCleanup = null;
  }

  const main = document.getElementById("app")!;
  document
    .querySelectorAll("nav a")
    .forEach((a) => a.classList.remove("active"));
  const active = document.querySelector(`nav a[href="${path}"]`);
  // Bootstrap's active class and ARIA current
  document.querySelectorAll('nav a').forEach((a) => {
    a.removeAttribute('aria-current');
  });
  if (active) {
    active.classList.add('active');
    (active as HTMLAnchorElement).setAttribute('aria-current', 'page');
  }
  // Normalize by stripping base path if present
  const normalized = path.startsWith(BASE) ? path.slice(BASE.length - (BASE.endsWith('/') ? 1 : 0)) : path;
  let [base, ...rest] = normalized.split("/").filter(Boolean); // e.g. ["works", "3"];
  if (base === undefined) {
    base = "";
  }
  const subPath = rest.join("/"); // e.g. "work-1";
  console.log(`[Router] Normalized: ${normalized}, Base: ${base}, SubPath: ${subPath}`);

  if (active) active.classList.add("active");
  switch ("/" + base) {
    case "/":
      main.innerHTML = homeView();
      break;
    case "/works":
      main.innerHTML = workView(Number(subPath));
      if (Number(subPath) > 0) {
        createScene(Number(subPath))();
        routeCleanup = initOverlayToggle();
      } else {
        initWorksGrid();
      }
      break;
    case "/about":
      main.innerHTML = aboutView();
      const aboutContainer = document.getElementById('about-scene');
      if (aboutContainer) {
        const cleanup = aboutScene(new THREE.Scene(), { mount: aboutContainer });
        setActiveCleanup(cleanup);
      }
      break;
  }
  console.log(`[Router] Navigation end: ${path}`);
}

// Expose for dynamic navigation calls from modules that avoid cyclic imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).renderRoutes = renderRoutes;
