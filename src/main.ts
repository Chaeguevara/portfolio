import { renderRoutes } from "./routes";

renderRoutes(location.pathname);

window.addEventListener('popstate',()=>{
  renderRoutes(location.pathname);
  console.log(location.pathname);
});

document.addEventListener('click',(e)=>{
  const link = (e.target as HTMLElement).closest('a[data-link]');
  if (link){
    e.preventDefault();
    const href = link.getAttribute('href')!;
    history.pushState(null,'',href);
    renderRoutes(href);
  }
})

