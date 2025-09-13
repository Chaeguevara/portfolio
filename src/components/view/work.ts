export function work(path:number){
  return `
<section class="work-wrap">
  <header class="work-header">
    <h1 class="work-title">Work ${path}</h1>
  </header>
  <div id="work" class="three-stage" aria-label="Three.js canvas mount"></div>
  
  <p class="work-note">Interactive scene below. Resize the window to fit.</p>
  
  <!-- The renderer will append its canvas into #work -->
</section>
`;
}
