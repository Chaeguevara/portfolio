/**
 * @fileoverview Study notes synced from Notion.
 * Run `npm run sync-notion` to update this file.
 * Each InProgressItem can have associated study notes.
 */

export interface StudyNote {
    date: string;
    topic: string;
    source: string;
    keyInsight: string;
    nextQuestion?: string;
}

export interface StudyLogEntry {
    projectId: string;
    concepts: { term: string; definition: string }[];
    notes: StudyNote[];
    lastSynced: string;
}

/**
 * Study logs keyed by project ID.
 * Auto-generated from Notion — do not edit manually.
 */
export const studyLogs: Record<string, StudyLogEntry> = {
    'mit-6849': {
        projectId: 'mit-6849',
        lastSynced: '2026-05-01',
        concepts: [
            { term: "Kawasaki's Theorem", definition: 'Alternating sum of sector angles at a flat-foldable vertex = 0. For degree-4: α₁+α₃ = α₂+α₄ = 180°.' },
            { term: "Maekawa's Theorem", definition: '|M − V| = 2 at every interior vertex. For degree-4: 3M:1V or 1M:3V.' },
            { term: 'ISO / ANTO', definition: 'ISO = adjacent creases same assignment (both M or both V). ANTO = opposite. Unique biggest sector must be ISO.' },
            { term: 'LFFG', definition: 'Local Flat-Foldability Graph. Nodes = vertices with local MV choices. Edges = shared creases. Global foldability = CSP on LFFG.' },
            { term: 'Rigid Foldability', definition: 'Stronger than flat-foldability. Crease pattern can fold continuously without bending faces. Miura-ori is rigidly foldable.' },
            { term: 'Wallpaper Groups', definition: '17 discrete symmetry groups of 2D periodic patterns. Miura-ori = p2, square twist = p4, hex twist = p6.' },
            { term: 'Type A vs B Periodicity', definition: 'Type A: crease pattern periodic. Type B: folded form periodic. Type A ⊄ Type B (e.g., hypar is Type A but not Type B).' },
        ],
        notes: [
            {
                date: '2026-03',
                topic: 'Local Flat-Foldability Graph (LFFG)',
                source: 'Demaine & O\'Rourke',
                keyInsight: 'LFFG = CSP on vertex-local MV constraints; global foldability = graph-wide consistency',
                nextQuestion: 'What is the complexity of LFFG satisfiability for regular tessellations?',
            },
            {
                date: '2026-03',
                topic: 'Maekawa + Kawasaki synthesis',
                source: 'Lecture notes',
                keyInsight: 'Kawasaki governs angles; Maekawa governs parity — they constrain different aspects independently',
                nextQuestion: 'Can both be satisfied while LFFG is unsatisfiable? Yes — need valid MV assignment too',
            },
            {
                date: '2026-04',
                topic: '4-Degree Vertex ISO/ANTO Rules',
                source: 'Self-study + Demaine Ch.11',
                keyInsight: 'Unique biggest angle sector must be ISO — this is forced by flat-foldability, not a design choice',
            },
            {
                date: '2026-05',
                topic: 'Periodicity in Twist Tessellations',
                source: 'Robert J. Lang — Twists, Tilings, and Tessellations',
                keyInsight: 'Periodicity = invariance under wallpaper group isometries. Crease pattern periodicity ≠ folded form periodicity.',
                nextQuestion: 'Which periodic crease patterns admit periodic folded states?',
            },
        ],
    },
    'mit-6042j': {
        projectId: 'mit-6042j',
        lastSynced: '2026-05-01',
        concepts: [],
        notes: [],
    },
    'coursera-comparch': {
        projectId: 'coursera-comparch',
        lastSynced: '2026-05-01',
        concepts: [],
        notes: [],
    },
    'togaf-cert': {
        projectId: 'togaf-cert',
        lastSynced: '2026-05-01',
        concepts: [],
        notes: [],
    },
};
