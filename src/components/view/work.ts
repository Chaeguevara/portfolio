import { Works } from "../../data/works";

export function work(path: number) {
  const data = Works[path];
  const details = data?.details ? `
    <div id="work-details-overlay" class="work-details" style="
      position: absolute; 
      bottom: 20px; 
      left: 20px; 
      background: rgba(0,0,0,0.8); 
      color: white; 
      padding: 20px; 
      border-radius: 8px; 
      max-width: 400px; 
      z-index: 10;
      pointer-events: auto;
      transition: opacity 0.3s ease;
    ">
      <h2 style="margin-top: 0; font-size: 1.5rem;">${data.title}</h2>
      <p style="font-size: 1rem; margin-bottom: 10px;">${data.body}</p>
      <hr style="border-color: rgba(255,255,255,0.2);">
      <div style="font-size: 0.9rem; line-height: 1.5;">
        ${data.details}
      </div>
      <small style="display:block; margin-top:10px; opacity:0.7; font-size: 0.8rem;">(Press 'h' to toggle details)</small>
    </div>
  ` : '';

  return `
<section class="work-wrap" style="position: relative; height: 100vh; overflow: hidden;">
  <div id="work" class="three-stage" aria-label="Three.js canvas mount" style="width: 100%; height: 100%;"></div>
  ${details}
</section>
`;
}
