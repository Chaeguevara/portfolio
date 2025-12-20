export function aboutView() {
  return `
  <div class="about-hero">
    <div id="about-scene" class="about-hero__scene"></div>
    <div class="about-hero__content">
      <h1>Heejin Chae</h1>
      <p>Computational Designer & Software Engineer</p>
    </div>
  </div>

  <div class="timeline-container">
    <h2 class="section-title">Professional Journey</h2>
    
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-year">2024</div>
        <div class="timeline-content card">
          <h5>Samoo Architects & Engineers (SAMSUNG)</h5>
          <p class="timeline-role">Project Operator | Digital Transformation Team</p>
          <ul>
            <li>Engineered Revit Family ecosystems for large-scale hospital design.</li>
            <li>Developed Revit Mass generation and custom drawing automation plugins.</li>
            <li>Optimized QA workflows using Dynamo and Pandas.</li>
          </ul>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-year">2023</div>
        <div class="timeline-content card">
          <h5>Front Inc</h5>
          <p class="timeline-role">Façade Consultant</p>
          <ul>
            <li>Minimized panel types for Qatar Stadium using Genetic Algorithms and Kangaroo physics.</li>
            <li>Developed master surface manipulation methodologies.</li>
          </ul>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-year">2022</div>
        <div class="timeline-content card">
          <h5>Seoul National University</h5>
          <p class="timeline-role">Senior Researcher</p>
          <ul>
            <li>Developed NLP-driven spatial analysis matching engines.</li>
            <li>Developed blockchain-based coupon authentication systems (Awarded Excellence).</li>
            <li>Published in major domestic academic journals.</li>
          </ul>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-year">2021 - 2019</div>
        <div class="timeline-content card">
          <h5>Syntegrate Japan & Korea</h5>
          <p class="timeline-role">BIM / Façade Consultant</p>
          <ul>
            <li><strong>Loro Piana Ginza:</strong> Coordinated structural and façade BIM coordination.</li>
            <li><strong>Louis Vuitton Midosuji:</strong> Optimized 400+ complex panels, significantly reducing costs.</li>
            <li><strong>Dubai Expo 2020:</strong> Managed parametric interoperability between Rhino and Catia.</li>
            <li><strong>Paradise Hotel:</strong> Curated panelization workflow for "The Imprint".</li>
          </ul>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-year">2017</div>
        <div class="timeline-content card">
          <h5>Yonsei University</h5>
          <p class="timeline-role">Research Assistant | IT Construction Lab</p>
          <ul>
            <li>Developed prototype structural health monitoring systems via Dynamo.</li>
            <li>Analyzed apartment defect data patterns via automated Excel frameworks.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  `;
}
