import { homeView } from "./views/home";
import { workView } from "./views/works";

export function renderRoutes(path: string) {
  const main = document.getElementById("app")!;
  document
    .querySelectorAll("nav a")
    .forEach((a) => a.classList.remove("active"));
  const active = document.querySelector(`nav a[href="${path}]`);
  if (active) active.classList.add("activate");
  switch (path) {
    case "/":
      main.innerHTML = homeView();
      break;
    case "/works":
      main.innerHTML = workView();
      break;
    default:
      main.innerHTML = "<h2> 404 not Found</h2>";
  }
}
