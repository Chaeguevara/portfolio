import { Works } from "../data/works";
import { work } from "../components/view/work";
import { Card } from "../components/view/card";
import { initCardPreviews } from "../previews";
const BASE = import.meta.env.BASE_URL || "/";
export function workView(subPath: number) {
  console.log(subPath);
  if (subPath){
    return work(subPath);
  }
  console.log("workview");
  console.log(subPath);
  return `<h1> Welcome Works </h1>
<p>This is the work page.</p>
<div id=\"cards-grid\" class=\"cards-grid\"></div>
<div id=\"grid-sentinel\" aria-hidden=\"true\"></div>`;
}

export function initWorksGrid() {
  const entries = Object.entries(Works).sort((a,b)=> Number(a[0]) - Number(b[0]));
  const PAGE_SIZE = 9; // 3 rows x 3 columns
  let offset = 0;
  const grid = document.getElementById('cards-grid');
  const sentinel = document.getElementById('grid-sentinel');
  if (!grid || !sentinel) return;

  const bindNavigation = (scope: ParentNode) => {
    scope.querySelectorAll('.card[data-href]:not([data-nav-bound])').forEach((card)=>{
      (card as HTMLElement).setAttribute('data-nav-bound','1');
      card.addEventListener('click', ()=>{
        const path = (card as HTMLElement).getAttribute('data-href');
        if (path){
          history.pushState({}, '', path);
          const anyWin = window as any;
          if (typeof anyWin.renderRoutes === 'function') {
            anyWin.renderRoutes(path);
          }
        }
      });
    });
  };

  const appendNext = () => {
    const slice = entries.slice(offset, offset + PAGE_SIZE);
    if (slice.length === 0) return false;
    const html = slice.map(([k, v]) => {
      const path = `${BASE}works/${k}`;
      return Card(v.title, v.body, path, k);
    }).join('');
    grid.insertAdjacentHTML('beforeend', html);
    bindNavigation(grid);
    initCardPreviews();
    offset += slice.length;
    return slice.length === PAGE_SIZE;
  };

  appendNext();

  const observer = new IntersectionObserver((entriesObs)=>{
    for (const entry of entriesObs) {
      if (entry.isIntersecting) {
        const hasMore = appendNext();
        if (!hasMore) observer.disconnect();
      }
    }
  }, { rootMargin: '200px' });
  observer.observe(sentinel);
}
