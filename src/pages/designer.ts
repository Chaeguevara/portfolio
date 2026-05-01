/**
 * @fileoverview Crease Pattern Designer page.
 * Full-page interactive crease pattern editor with configuration panel,
 * real-time flat-foldability validation, and SVG/PDF export.
 */

export function designerView() {
    return `
<div class="designer-layout">
  <aside class="designer-sidebar">
    <div class="designer-sidebar__section">
      <h3>Pattern</h3>
      <select id="pattern-select" class="designer-select">
        <option value="miura">Miura-ori</option>
        <option value="square-twist">Square Twist</option>
        <option value="diagonal">Diagonal Grid</option>
        <option value="waterbomb">Waterbomb</option>
      </select>
    </div>

    <div class="designer-sidebar__section">
      <h3>Grid Size</h3>
      <label class="designer-slider-label">
        Columns: <span id="cols-val">8</span>
        <input type="range" id="cols-slider" min="3" max="16" value="8" class="designer-slider" />
      </label>
      <label class="designer-slider-label">
        Rows: <span id="rows-val">6</span>
        <input type="range" id="rows-slider" min="3" max="16" value="6" class="designer-slider" />
      </label>
    </div>

    <div class="designer-sidebar__section">
      <h3>Paper Size (mm)</h3>
      <label class="designer-slider-label">
        Width: <span id="paper-w-val">210</span>
        <input type="range" id="paper-w-slider" min="100" max="500" value="210" step="10" class="designer-slider" />
      </label>
      <label class="designer-slider-label">
        Height: <span id="paper-h-val">210</span>
        <input type="range" id="paper-h-slider" min="100" max="500" value="210" step="10" class="designer-slider" />
      </label>
    </div>

    <div class="designer-sidebar__section">
      <h3>Validation</h3>
      <div id="validation-status" class="designer-status">
        <span class="status-dot status-dot--ok"></span>
        Checking...
      </div>
    </div>

    <div class="designer-sidebar__section">
      <h3>Export</h3>
      <button id="export-svg" class="designer-btn">Download SVG</button>
      <button id="export-pdf" class="designer-btn">Download PDF</button>
      <button id="export-stl" class="designer-btn designer-btn--accent">Download STL (3D Print)</button>
    </div>

    <div class="designer-sidebar__section designer-sidebar__section--help">
      <p><strong>Click</strong> crease to toggle M/V</p>
      <p><strong>Red dots</strong> = invalid vertices</p>
      <p>M = Mountain (solid red)</p>
      <p>V = Valley (dashed blue)</p>
      <hr style="border-color: var(--divider); margin: 8px 0;" />
      <p><strong>3D Print STL:</strong></p>
      <p>Panels = 2mm solid slabs</p>
      <p>Creases = 0.4mm living hinges</p>
      <p>0.3mm gap for flexibility</p>
    </div>
  </aside>

  <main class="designer-canvas-area">
    <canvas id="designer-canvas"></canvas>
    <div class="designer-ad" id="designer-ad-slot">
      <!-- AdSense ad unit inserted here -->
    </div>
  </main>
</div>
`;
}
