export function homeView() {
  return `
  <section class="hero">
    <div class="hero__content">
      <h1 class="hero__title">Bridging Architecture <span class="hero__accent">&</span> Code.</h1>
      <p class="hero__subtitle">
        Solutions Architect at <strong>Autodesk</strong>. 
        Designing solutions with Autodesk products. Highly motivated by handling complex geometry in the digital realm.
      </p>
      <div class="hero__actions">
        <a href="/portfolio/works" class="btn btn--primary" data-link>View Works</a>
        <a href="/portfolio/about" class="btn btn--secondary" data-link>About My Journey</a>
      </div>
    </div>
  </section>

  <section class="features">
    <div class="feature-card">
      <h3>Digital Transformation</h3>
      <p>Consulting on AEC+O workflows and delivering technical solutions for industry-leading clients.</p>
    </div>
    <div class="feature-card">
      <h3>Geometry Optimization</h3>
      <p>Specializing in DfMA and complex façade unrolling for global landmarks and luxury retail.</p>
    </div>
    <div class="feature-card">
      <h3>3D Development</h3>
      <p>Building custom 3D web applications and automation tools using Three.js and Autodesk Platform Services.</p>
    </div>
  </section>
  `;
}
