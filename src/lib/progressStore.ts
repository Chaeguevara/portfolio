/**
 * @fileoverview LocalStorage wrapper for persisting progress tracking data.
 */

import type { DailyProgress } from '../data/inProgress';

const STORAGE_KEY = 'portfolio_progress_tracker';

/**
 * Progress data structure: { projectId: { "YYYY-MM-DD": { done, planned } } }
 */
export type ProgressData = Record<string, Record<string, DailyProgress>>;

/**
 * Load all progress data from localStorage
 */
export function loadProgressData(): ProgressData {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Failed to load progress data:', error);
        return {};
    }
}

/**
 * Save all progress data to localStorage
 */
export function saveProgressData(data: ProgressData): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save progress data:', error);
    }
}

/**
 * Get progress entries for a specific project
 */
export function getProjectProgress(projectId: string): Record<string, DailyProgress> {
    const data = loadProgressData();
    return data[projectId] || {};
}

/**
 * Save a daily progress entry for a project
 */
export function saveDailyProgress(
    projectId: string,
    date: string,
    progress: DailyProgress
): void {
    const data = loadProgressData();
    if (!data[projectId]) {
        data[projectId] = {};
    }
    data[projectId][date] = progress;
    saveProgressData(data);
}

/**
 * Delete a daily progress entry
 */
export function deleteDailyProgress(projectId: string, date: string): void {
    const data = loadProgressData();
    if (data[projectId] && data[projectId][date]) {
        delete data[projectId][date];
        saveProgressData(data);
    }
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get the current week's dates (Monday to Sunday)
 */
export function getCurrentWeek(referenceDate: Date = new Date()): Date[] {
    const dates: Date[] = [];
    const current = new Date(referenceDate);

    // Get to Monday of current week
    const day = current.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Adjust when day is Sunday
    current.setDate(current.getDate() + diff);

    // Get 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return formatDate(date1) === formatDate(date2);
}
