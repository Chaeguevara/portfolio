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
      <small class="work-details-overlay__hint">(Press 'h' to toggle details)</small>
    </div>
  ` : '';

  return `
<section class="work-wrap work-wrap--fullscreen">
  <div id="work" class="three-stage three-stage--fullscreen" aria-label="Three.js canvas mount"></div>
  
  <button id="info-toggle" class="info-toggle-btn" aria-label="Toggle details">
    ?
  </button>

  ${details}
</section>
`;
}

