export function Card(title: string, body: string) {
  return `
  <div class="card">
    <div class="card-body">
      <h5>${title}</h5>
      <p class="card-text">${body}</p>
    </div>
  </div>
`;
}
