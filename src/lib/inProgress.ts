/**
 * @fileoverview Manages the "In Progress" navbar dropdown functionality.
 */

import { inProgressItems } from '../data/inProgress';
import { progressTracker } from '../components/ProgressTracker';

/**
 * Populates the in-progress dropdown menu with items from the data source
 */
export function initInProgressDropdown(): void {
    const container = document.getElementById('in-progress-list');
    if (!container) return;

    // Group items by category
    const grouped = inProgressItems.reduce(
        (acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        },
        {} as Record<string, Array<typeof inProgressItems[number]>>
    );

    // Render grouped items
    let html = '';
    for (const [category, items] of Object.entries(grouped)) {
        // Capitalize first letter
        const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
        html += `<div class="dropdown-category">${categoryLabel}</div>`;

        for (const item of items) {
            html += `<a href="#" class="progress-link" data-project-id="${item.id}">${item.title}</a>`;
        }
    }

    container.innerHTML = html;

    // Add click event listeners
    container.querySelectorAll('.progress-link').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = (e.currentTarget as HTMLElement).getAttribute('data-project-id');
            const project = inProgressItems.find(p => p.id === projectId);
            if (project) {
                progressTracker.open(project);
            }
        });
    });
}
