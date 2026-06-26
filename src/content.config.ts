import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Vault frontmatter writes wiki-link lists in mixed shapes:
//   prereqs: [[[crease-pattern]]]            -> [['crease-pattern']]
//   related: ["[[greedy-algorithms]]"]       -> ['[[greedy-algorithms]]']
//   pair: "[[kawasaki-theorem.ko]]"          -> '[[kawasaki-theorem.ko]]'
// Normalize all of them to plain slugs.
const stripLink = (s: string) =>
  s
    .replace(/^\[\[|\]\]$/g, '')
    .split('|')[0]
    .split('/')
    .pop()!
    .trim();

const linkList = z.preprocess((v) => {
  if (v == null) return [];
  const flat = (Array.isArray(v) ? v : [v]).flat(Infinity);
  return flat.filter((x): x is string => typeof x === 'string').map(stripLink);
}, z.array(z.string()));

const concepts = defineCollection({
  // Default generateId slugifies away the ".ko" suffix (dynamic-array.ko ->
  // dynamic-arrayko); keep the literal filename so pair lookups and synced
  // /study/<slug>.ko/ links resolve.
  loader: glob({
    pattern: '*.md',
    base: './src/content/study/concepts',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    type: z.literal('concept'),
    title: z.string(),
    lang: z.enum(['en', 'ko']).default('en'),
    pair: z.preprocess((v) => (typeof v === 'string' ? stripLink(v) : undefined), z.string().optional()),
    course: z.string().optional(),
    courses: z.array(z.string()).optional(),
    lectures: z.array(z.number()).optional(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    prereqs: linkList,
    related: linkList,
    source: linkList,
    status: z.string().default('draft'),
  }),
});

const maps = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/study/maps' }),
  schema: z.object({
    type: z.literal('map'),
    title: z.string(),
    summary: z.string().optional(),
  }),
});

export const collections = { concepts, maps };
