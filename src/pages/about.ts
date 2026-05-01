export function aboutView() {
  return `
  <div class="about-hero">
    <div id="about-scene" class="about-hero__scene"></div>
    <div class="about-hero__content">
      <h1>Heejin Chae</h1>
      <p>Computational Geometry & Software Engineering</p>
    </div>
  </div>

  <div class="timeline-container">
    <h2 class="section-title">Professional Journey</h2>
    
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-year">2024 - PRES</div>
        <div class="timeline-content card">
          <h5>Autodesk</h5>
          <p class="timeline-role">Solutions Architect (Feb 2025 - Present)</p>
          <ul>
            <li>Focusing on professional solutions architecture for enterprise clients.</li>
            <li>Applying computational geometry expertise to AEC industry 3D solutions.</li>
          </ul>
          <p class="timeline-role" style="margin-top: 1rem;">Technical Solution Executive (Jun 2024 - Feb 2025)</p>
          <ul>
            <li>In charge of Autodesk Construction Cloud.</li>
            <li>Consulting on Digital Transformation and BIM workflows for strategic Korean AEC enterprise customers.</li>
            <li>Delivering technical expertise in Autodesk Platform Services (APS) and cloud-based 3D solutions.</li>
          </ul>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-year">2023 - 2024</div>
        <div class="timeline-content card">
          <h5>Samoo Architects & Engineers (SAMSUNG)</h5>
          <p class="timeline-role">BIM Engineer</p>
          <ul>
            <li><strong>Tower Information Visualizer:</strong> Developed Electron + R3F app to visualize tower data from Excel into 3D shapes and charts.</li>
            <li><strong>Space Program Creator:</strong> Built pyrevit tool to convert Excel space programs into Revit Masses, reducing manual work from 2 hours to 6 minutes.</li>
            <li>Engineered Revit Family ecosystems for large-scale hospital design.</li>
            <li>Optimized geometric workflows using Dynamo and Pandas.</li>
          </ul>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-year">2023</div>
        <div class="timeline-content card">
          <h5>Front Inc</h5>
          <p class="timeline-role">Facade Engineer</p>
          <ul>
            <li>Consulted on complex geometry rationalization and DfMA for signature architectural projects.</li>
            <li>Developed master surface manipulation methodologies and paneling logic.</li>
          </ul>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-year">2021</div>
        <div class="timeline-content card">
          <h5>로워크 (Lowork)</h5>
          <p class="timeline-role">Backend Developer</p>
          <ul>
            <li><strong>REST API:</strong> Spring framework + MySQL with JWT Token-based authorization and JPA Repository.</li>
            <li><strong>Single Sign-On:</strong> Set up SSO with Red Hat Keycloak for secure authentication.</li>
          </ul>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-year">2018 - 2019</div>
        <div class="timeline-content card">
          <h5>Syntegrate Japan & Korea</h5>
          <p class="timeline-role">BIM / Façade Consultant</p>
          <ul>
            <li><strong>Loro Piana Ginza:</strong> Coordinated structural and façade BIM coordination.</li>
            <li><strong>Louis Vuitton Midosuji:</strong> Optimized 400+ complex panels via DfMA principles.</li>
            <li><strong>Dubai Expo 2020:</strong> Managed parametric interoperability between Rhino and Catia.</li>
            <li><strong>Paradise City:</strong> Developed panelization workflows for "The Imprint".</li>
          </ul>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-year">2021 - 2023</div>
        <div class="timeline-content card">
          <h5>Seoul National University (서울대학교)</h5>
          <p class="timeline-role">Master of Science - MS</p>
          <ul>
            <li>Researched Machine Learning-based Geospatial Analysis and NLP.</li>
            <li>Computational geometry applications in architectural design and fabrication.</li>
            <li><strong>Excellence Award:</strong> DID-based Coupon Book Management System using blockchain.</li>
            <li>Thesis: Procedures for extracting geospatial analysis workflows from natural language.</li>
          </ul>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-year">2009 - 2017</div>
        <div class="timeline-content card">
          <h5>Yonsei University (연세대학교)</h5>
          <p class="timeline-role">Bachelor of Architecture</p>
          <ul>
            <li><strong>Research Assistant (2017):</strong> Building Informatics Group - developed prototype structural health monitoring systems via Dynamo.</li>
            <li>Data analysis via Excel, VBA, and Python.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="certifications-container">
    <h2 class="section-title">Licenses & Certifications</h2>
    <div class="cert-grid">
      <div class="cert-card card">
        <h4>Computational Geometry</h4>
        <ul>
          <li><strong>MIT 6.849:</strong> Geometric Folding Algorithms - Linkages, Origami, Polyhedra (In Progress)</li>
          <li><strong>MIT 6.042J:</strong> Mathematics for Computer Science (In Progress)</li>
        </ul>
      </div>

      <div class="cert-card card">
        <h4>AEC & BIM</h4>
        <ul>
          <li><strong>Autodesk Docs:</strong> Getting Started (2024)</li>
        </ul>
      </div>

      <div class="cert-card card">
        <h4>AI & Machine Learning</h4>
        <ul>
          <li><strong>Deep Learning Specialization:</strong> DeepLearning.AI (2023)</li>
          <li><strong>Reinforcement Learning Specialization:</strong> Univ. of Alberta (2023)</li>
          <li><strong>Sample-based Learning Methods:</strong> Univ. of Alberta (2023)</li>
          <li><strong>Sequence Models:</strong> DeepLearning.AI (2022)</li>
          <li><strong>Text Mining Practice and Analysis:</strong> Yonsei University (2019)</li>
          <li><strong>Intro to Big Data:</strong> UCSD (2020)</li>
        </ul>
      </div>

      <div class="cert-card card">
        <h4>Web3 & Blockchain</h4>
        <ul>
          <li><strong>Hyperledger Aries Developer:</strong> edX (2021)</li>
          <li><strong>Decentralized Identity Applications:</strong> edX (2021)</li>
          <li><strong>DeFi Infrastructure & Primitives:</strong> Duke Univ. (2022)</li>
          <li><strong>Hyperledger Indy, Aries & Ursa:</strong> edX (2021)</li>
        </ul>
      </div>

      <div class="cert-card card">
        <h4>Software Development</h4>
        <ul>
          <li><strong>Front-End Web Development with React:</strong> HKUST (2022)</li>
          <li><strong>Docker Basics:</strong> Coursera (2021)</li>
          <li><strong>Open Source Software Development:</strong> Linux Foundation (2021)</li>
        </ul>
      </div>
    </div>
  </div>
  `;
}
