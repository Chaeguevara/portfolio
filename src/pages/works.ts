import { Works, type WorkCategory } from "../data/works";
import { work } from "../components/view/work";
import { Card } from "../components/view/card";
import { initCardPreviews } from "../previews";
import { navigate } from "../routes";
const BASE = import.meta.env.BASE_URL || "/";
export function workView(subPath: number) {
  if (subPath) {
    return work(subPath);
  }
  return `
<section class="works-section">
  <h2 class="section-title">Featured Projects</h2>
  <p class="section-subtitle">Geometric folding, curved surface mapping, and computational geometry</p>
  <div id="featured-grid" class="cards-grid"></div>
</section>

<section class="works-section works-section--fundamentals">
  <h2 class="section-title">Three.js Fundamentals</h2>
  <p class="section-subtitle">Core concepts and technique explorations</p>
  <div id="fundamentals-grid" class="cards-grid"></div>
</section>
`;
}

function renderCategory(gridId: string, category: WorkCategory) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const entries = Object.entries(Works)
    .filter(([, v]) => v.category === category)
    .sort((a, b) => Number(b[0]) - Number(a[0]));

  const html = entries.map(([k, v]) => {
    const path = `${BASE}works/${k}`;
    return Card(v.title, v.body, path, k);
  }).join('');

  grid.innerHTML = html;
  bindNavigation(grid);
}

function bindNavigation(scope: ParentNode) {
  scope.querySelectorAll('.card[data-href]:not([data-nav-bound])').forEach((card) => {
    (card as HTMLElement).setAttribute('data-nav-bound', '1');
    card.addEventListener('click', () => {
      const path = (card as HTMLElement).getAttribute('data-href');
      if (path) navigate(path);
    });
  });
}

export function initWorksGrid() {
  renderCategory('featured-grid', 'featured');
  renderCategory('fundamentals-grid', 'fundamentals');
  initCardPreviews();
}
