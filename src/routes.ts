import { homeView } from "./pages/home";
import { workView } from "./pages/works";
import { createScene } from "./scene";
import { initWorksGrid } from "./pages/works";
const BASE = import.meta.env.BASE_URL || "/";

function setupCardNavigation() {
  document.querySelectorAll(".card[data-href]").forEach((card) => {
    card.addEventListener("click", () => {
      const path = card.getAttribute("data-href");
      if (path) {
        history.pushState({}, "", path);
        renderRoutes(path);
      }
    });
  });
}

export function renderRoutes(path: string) {
  const main = document.getElementById("app")!;
  document
    .querySelectorAll("nav a")
    .forEach((a) => a.classList.remove("active"));
  const active = document.querySelector(`nav a[href="${path}"]`);
  // Bootstrap's active class and ARIA current
  document.querySelectorAll('nav a').forEach((a)=>{
    a.removeAttribute('aria-current');
  });
  if (active) {
    active.classList.add('active');
    (active as HTMLAnchorElement).setAttribute('aria-current','page');
  }
  // Normalize by stripping base path if present
  const normalized = path.startsWith(BASE) ? path.slice(BASE.length - (BASE.endsWith('/') ? 1 : 0)) : path;
  let [base, ...rest] = normalized.split("/").filter(Boolean); // e.g. ["works", "3"];
  if (base === undefined) {
    base = "";
  }
  const subPath = rest.join("/"); // e.g. "work-1";

  if (active) active.classList.add("active");
  switch ("/" + base) {
    case "/":
      main.innerHTML = homeView();
      break;
    case "/works":
      main.innerHTML = workView(Number(subPath));
      if (Number(subPath)>0){
        createScene(Number(subPath))();
      } else {
        initWorksGrid();
      }
      break;
    default:
      main.innerHTML = "<h2> 404 not Found</h2>";
  }
  setupCardNavigation();
}

// Expose for dynamic navigation calls from modules that avoid cyclic imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).renderRoutes = renderRoutes;
