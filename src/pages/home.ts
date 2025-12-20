export function homeView() {
  return `
  <section class="hero">
    <div class="hero__content">
      <h1 class="hero__title">Bridging Architecture <span class="hero__accent">&</span> Code.</h1>
      <p class="hero__subtitle">
        Digital Transformation expert at <strong>Samoo Architects & Engineers</strong>. 
        Specializing in BIM automation, computational design, and full-stack development.
      </p>
      <div class="hero__actions">
        <a href="/portfolio/works" class="btn btn--primary" data-link>View Works</a>
        <a href="/portfolio/about" class="btn btn--secondary" data-link>About My Journey</a>
      </div>
    </div>
  </section>

  <section class="features">
    <div class="feature-card">
      <h3>Automation</h3>
      <p>Building Revit & Dynamo plugins to streamline multi-billion dollar architectural projects.</p>
    </div>
    <div class="feature-card">
      <h3>Optimization</h3>
      <p>Algorithmic paneling and geometric optimization for global landmarks like LVMH Ginza.</p>
    </div>
    <div class="feature-card">
      <h3>Intelligence</h3>
      <p>Researching the intersection of NLP and spatial analysis at Seoul National University.</p>
    </div>
  </section>
  `;
}
