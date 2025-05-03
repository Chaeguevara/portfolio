import { Works } from "../data/works";
import { Card } from "../components/card";
export function workView(subPath: number) {
  console.log("workview")
  console.log(subPath)
  return `<h1> Welcome Works </h1>
<p>This is the work page.</p>
${Object.entries(Works).map(([_, v]) => {
console.log(v);
  return Card(v.title, v.body);
})}
`;
}
