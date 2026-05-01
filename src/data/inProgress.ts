/**
 * @fileoverview Tracks current learning and projects in progress.
 */

/**
 * Represents an in-progress learning or project item
 */
export interface InProgressItem {
    readonly id: string;
    readonly title: string;
    readonly url?: string;
    readonly category: 'learning' | 'project' | 'certification';
}

/**
 * Daily progress entry for a project
 */
export interface DailyProgress {
    done: string;
    planned: string;
}

/**
 * Current learning and projects in progress
 */
export const inProgressItems: readonly InProgressItem[] = [
    {
        id: 'mit-6849',
        title: 'MIT 6.849 Geometric Folding Algorithms',
        url: 'https://ocw.mit.edu/courses/6-849-geometric-folding-algorithms-linkages-origami-polyhedra-fall-2012/',
        category: 'learning'
    },
    {
        id: 'mit-6042j',
        title: 'MIT 6042J',
        url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
        category: 'learning'
    },
    {
        id: 'coursera-comparch',
        title: 'Coursera Computer Architecture',
        url: 'https://www.coursera.org/learn/comparch',
        category: 'learning'
    },
    {
        id: 'togaf-cert',
        title: 'TOGAF Certification',
        url: 'https://www.opengroup.org/togaf',
        category: 'certification'
    }
];
