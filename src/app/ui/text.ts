import { Text } from 'troika-three-text';

export interface TextOpts {
  text: string;
  size: number;
  color: number | string;
  maxWidth?: number;
  anchorX?: string;
  anchorY?: string;
}

export function makeText(opts: TextOpts): Text {
  const t = new Text();
  t.text = opts.text;
  t.fontSize = opts.size;
  t.color = opts.color;
  if (opts.maxWidth !== undefined) t.maxWidth = opts.maxWidth;
  if (opts.anchorX !== undefined) t.anchorX = opts.anchorX;
  if (opts.anchorY !== undefined) t.anchorY = opts.anchorY;
  t.sync();
  return t;
}

export function disposeText(t: Text): void {
  t.dispose();
}
