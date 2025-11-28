export function aboutView() {
    return `
    <div class="about-container" style="position: relative; width: 100%; height: 80vh; overflow: hidden;">
      <div id="about-scene" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;"></div>
      <div class="content" style="position: relative; z-index: 1; pointer-events: none; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
        <h1 style="font-size: 4rem; font-weight: bold; margin-bottom: 1rem;">About Me</h1>
        <p style="font-size: 1.5rem; max-width: 600px;">
          I am a creative developer exploring the intersection of code and art.
          <br>
          Welcome to my digital playground.
        </p>
      </div>
    </div>
  `;
}
