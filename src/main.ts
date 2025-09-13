import { renderRoutes } from "./routes";
import "./style.css";
const BASE = import.meta.env.BASE_URL || "/";

renderRoutes(location.pathname);

window.addEventListener('popstate',()=>{
  renderRoutes(location.pathname);
  console.log(location.pathname);
});

document.addEventListener('click',(e)=>{
  const link = (e.target as HTMLElement).closest('a[data-link]');
  if (link){
    e.preventDefault();
    let href = link.getAttribute('href')!;
    if (!href.startsWith(BASE)) {
      if (href.startsWith('/')) href = href.replace('/', BASE);
      else href = BASE + href;
    }
    history.pushState(null,'',href);
    renderRoutes(href);
  }
});
