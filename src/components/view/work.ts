import { Works } from "../../data/works";

/**
 * Renders a single work detail page with Three.js mount and overlay panel.
 * @param path - Work ID from the URL.
 */
export function work(path: number) {
  const data = Works[path];
  const details = data?.details ? `
    <div id="work-details-overlay" class="work-details-overlay">
      <h2 class="work-details-overlay__title">${data.title}</h2>
      <p class="work-details-overlay__body">${data.body}</p>
      <hr class="work-details-overlay__divider">
      <div class="work-details-overlay__content">
        ${data.details}
      </div>
      <small class="work-details-overlay__hint">(Press 'h' or 'i' button to toggle details)</small>
    </div>
  ` : '';

  // Portfolio-style description content
  const portfolioContent = data?.details ? `
    <section class="work-description">
      <div class="work-description__header">
        <h1>${data.title}</h1>
        <p class="work-description__subtitle">${data.body}</p>
      </div>
      <div class="work-description__content card">
        ${data.details}
      </div>
    </section>
  ` : '';

  return `
<section class="work-wrap work-wrap--fullscreen">
  <div id="work" class="three-stage three-stage--fullscreen" aria-label="Three.js canvas mount"></div>
  
  <button id="info-toggle" class="info-toggle-btn" aria-label="Toggle details">
    i
  </button>

  ${details}
</section>

${portfolioContent}
`;
}

