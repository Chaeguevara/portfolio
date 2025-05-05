import { Works } from "../data/works";
import { work } from "../components/view/work";
import { Card } from "../components/view/card";
export function workView(subPath: number) {
  console.log(subPath);
  if (subPath){
    return work(subPath);
  }
  console.log("workview")
  console.log(subPath)
  return `<h1> Welcome Works </h1>
<p>This is the work page.</p>
${Object.entries(Works).map(([k, v]) => {
  console.log(k,v);
  const path = "/works/"+k
  console.log(path)
  return Card(v.title, v.body,path);
})}
`;
}
