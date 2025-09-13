export function Card(title: string, body: string, path:string, id?: string) {
  return `
  <div class="card" data-href="${path}" ${id ? `data-work-id="${id}"` : ''}>
    <div class="card-body">
      <h5>${title}</h5>
      <p class="card-text">${body}</p>
    </div>
    <div class="card-preview" ${id ? `id="preview-${id}"` : ''}></div>
  </div>
`;
}
