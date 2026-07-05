// Minimal XML/DOM shim so node self-checks can run svgImport (which uses
// DOMParser). Supports the element tree, attributes, children, parentElement,
// and querySelector — enough for src/app/fold/svgImport.ts.
class El {
  constructor(tag) {
    this.tagName = tag;
    this.attributes = {};
    this.children = [];
    this.parentElement = null;
  }
  getAttribute(n) {
    return n in this.attributes ? this.attributes[n] : null;
  }
  querySelector(sel) {
    if (this.tagName === sel) return this;
    for (const c of this.children) {
      const r = c.querySelector(sel);
      if (r) return r;
    }
    return null;
  }
}
function parse(xml) {
  xml = xml.replace(/<\?[^>]*\?>/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<!DOCTYPE[^>]*>/gi, '');
  const root = new El('#doc');
  const stack = [root];
  const re = /<(\/?)([a-zA-Z][\w:-]*)((?:\s+[\w:-]+\s*=\s*"[^"]*")*)\s*(\/?)>/g;
  let m;
  while ((m = re.exec(xml))) {
    const [, close, tag, attrs, self] = m;
    if (close) {
      stack.pop();
      continue;
    }
    const el = new El(tag);
    const ar = /([\w:-]+)\s*=\s*"([^"]*)"/g;
    let a;
    while ((a = ar.exec(attrs))) el.attributes[a[1]] = a[2];
    const parent = stack[stack.length - 1];
    el.parentElement = parent.tagName === '#doc' ? null : parent;
    parent.children.push(el);
    if (!self) stack.push(el);
  }
  return { querySelector: (s) => root.querySelector(s) };
}
export class DOMParser {
  parseFromString(t) {
    return parse(t);
  }
}
export function installDOM() {
  globalThis.DOMParser = DOMParser;
}
