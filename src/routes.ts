import { homeView } from "./views/home";
import { workView } from "./views/works";

export function renderRoutes(path: string) {
  const main = document.getElementById("app")!;
  document
    .querySelectorAll("nav a")
    .forEach((a) => a.classList.remove("active"));
  const active = document.querySelector(`nav a[href="${path}]`);
  let [base, ...rest] = path.split("/").filter(Boolean); // e.g. ["works", "work-1"];
  if (base===undefined){
    base = ""
  }
  const subPath = rest.join("/"); // e.g. "work-1";

  if (active) active.classList.add("activate");
  switch ("/" + base) {
    case "/":
      main.innerHTML = homeView();
      break;
    case "/works":
      main.innerHTML = workView(Number(subPath));
      break;
    default:
      main.innerHTML = "<h2> 404 not Found</h2>";
  }
}
