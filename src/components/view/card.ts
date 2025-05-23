export function Card(title: string, body: string, path:string) {
  return `
  <div class="card" data-href=${path}>
    <div class="card-body">
      <h5>${title}</h5>
      <p class="card-text">${body}</p>
    </div>
  </div>
`;
}
