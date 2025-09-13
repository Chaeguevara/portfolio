import { homeView } from "./pages/home";
import { workView } from "./pages/works";
import { createScene } from "./scene";

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
  let [base, ...rest] = path.split("/").filter(Boolean); // e.g. ["works", "work-1"];
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
      }
      break;
    default:
      main.innerHTML = "<h2> 404 not Found</h2>";
  }
  setupCardNavigation();
}
