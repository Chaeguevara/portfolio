/**
 * @fileoverview Progress tracker modal component for tracking daily learning progress.
 */

import type { InProgressItem, DailyProgress } from '../data/inProgress';
import {
    formatDate,
    getCurrentWeek,
    isSameDay,
    getProjectProgress,
    saveDailyProgress,
} from '../lib/progressStore';
import { studyLogs } from '../data/studyNotes';

/**
 * Creates and manages the progress tracker modal
 */
export class ProgressTracker {
    private modal: HTMLElement | null = null;
    private currentProject: InProgressItem | null = null;
    private currentWeekStart: Date = new Date();
    private selectedDate: Date | null = null;

    /**
     * Open the tracker for a specific project
     */
    public open(project: InProgressItem): void {
        this.currentProject = project;
        this.currentWeekStart = new Date();
        this.render();
    }

    /**
     * Close the tracker
     */
    public close(): void {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }

    /**
     * Render the modal
     */
    private render(): void {
        // Remove existing modal if any
        this.close();

        // Create modal container
        this.modal = document.createElement('div');
        this.modal.className = 'progress-tracker-modal';
        this.modal.innerHTML = `
      <div class="progress-tracker-backdrop"></div>
      <div class="progress-tracker-container">
        <div class="progress-tracker-header">
          <h2>${this.currentProject?.title}</h2>
          ${this.currentProject?.url ? `<a href="${this.currentProject.url}" target="_blank" rel="noopener noreferrer" class="project-link">View Course →</a>` : ''}
          <button class="close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="progress-tracker-body">
          ${this.renderStudyNotes()}
          ${this.renderWeekCalendar()}
          ${this.renderDayDetails()}
        </div>
      </div>
    `;

        // Event listeners
        this.modal.querySelector('.close-btn')?.addEventListener('click', () => this.close());
        this.modal.querySelector('.progress-tracker-backdrop')?.addEventListener('click', () => this.close());

        // Week navigation
        this.modal.querySelector('.week-nav-prev')?.addEventListener('click', () => this.previousWeek());
        this.modal.querySelector('.week-nav-next')?.addEventListener('click', () => this.nextWeek());

        // Day selection
        this.modal.querySelectorAll('.calendar-day').forEach((day, index) => {
            day.addEventListener('click', () => this.selectDay(index));
        });

        // Save form
        const saveBtn = this.modal.querySelector('.save-progress-btn');
        saveBtn?.addEventListener('click', () => this.saveProgress());

        document.body.appendChild(this.modal);
    }

    /**
     * Render study notes from Notion sync
     */
    private renderStudyNotes(): string {
        if (!this.currentProject) return '';
        const log = studyLogs[this.currentProject.id];
        if (!log || (log.concepts.length === 0 && log.notes.length === 0)) return '';

        let html = '<div class="study-notes">';

        // Key concepts
        if (log.concepts.length > 0) {
            html += '<div class="study-notes__section">';
            html += '<h4 class="study-notes__title">Key Concepts</h4>';
            html += '<div class="study-notes__concepts">';
            for (const c of log.concepts) {
                html += `<div class="concept-chip">
                    <span class="concept-chip__term">${c.term}</span>
                    <span class="concept-chip__def">${c.definition}</span>
                </div>`;
            }
            html += '</div></div>';
        }

        // Study log
        if (log.notes.length > 0) {
            html += '<div class="study-notes__section">';
            html += '<h4 class="study-notes__title">Study Log</h4>';
            for (const n of log.notes) {
                html += `<div class="study-note-card">
                    <div class="study-note-card__header">
                        <span class="study-note-card__date">${n.date}</span>
                        <span class="study-note-card__topic">${n.topic}</span>
                    </div>
                    <div class="study-note-card__source">${n.source}</div>
                    <div class="study-note-card__insight">💡 ${n.keyInsight}</div>
                    ${n.nextQuestion ? `<div class="study-note-card__next">❓ ${n.nextQuestion}</div>` : ''}
                </div>`;
            }
            html += '</div>';
        }

        html += `<div class="study-notes__synced">Synced from Notion — ${log.lastSynced}</div>`;
        html += '</div>';
        return html;
    }

    /**
     * Render week calendar
     */
    private renderWeekCalendar(): string {
        const week = getCurrentWeek(this.currentWeekStart);
        const today = new Date();
        const progressData = this.currentProject ? getProjectProgress(this.currentProject.id) : {};

        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        const daysHtml = week.map((date, index) => {
            const isToday = isSameDay(date, today);
            const isSelected = this.selectedDate && isSameDay(date, this.selectedDate);
            const dateKey = formatDate(date);
            const hasProgress = !!progressData[dateKey];

            return `
        <div class="calendar-day ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${hasProgress ? 'has-progress' : ''}" data-index="${index}">
          <div class="day-name">${dayNames[index]}</div>
          <div class="day-number">${date.getDate()}</div>
          ${hasProgress ? '<div class="progress-indicator">✓</div>' : ''}
        </div>
      `;
        }).join('');

        const monthYear = week[3].toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        return `
      <div class="week-calendar">
        <div class="week-header">
          <button class="week-nav-prev" aria-label="Previous week">‹</button>
          <div class="week-title">${monthYear}</div>
          <button class="week-nav-next" aria-label="Next week">›</button>
        </div>
        <div class="calendar-grid">
          ${daysHtml}
        </div>
      </div>
    `;
    }

    /**
     * Render day details/form
     */
    private renderDayDetails(): string {
        if (!this.selectedDate || !this.currentProject) {
            return `
        <div class="day-details-empty">
          <p>Select a day to view or add progress</p>
        </div>
      `;
        }

        const dateKey = formatDate(this.selectedDate);
        const progressData = getProjectProgress(this.currentProject.id);
        const dayProgress = progressData[dateKey] || { done: '', planned: '' };

        const dateStr = this.selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });

        return `
      <div class="day-details">
        <h3>${dateStr}</h3>
        <div class="progress-form">
          <div class="form-group">
            <label for="progress-done">What I did today</label>
            <textarea 
              id="progress-done" 
              placeholder="e.g., Completed Chapter 3, Solved 10 practice problems..."
              rows="4"
            >${dayProgress.done}</textarea>
          </div>
          <div class="form-group">
            <label for="progress-planned">What to do next</label>
            <textarea 
              id="progress-planned" 
              placeholder="e.g., Start Chapter 4, Review graph algorithms..."
              rows="4"
            >${dayProgress.planned}</textarea>
          </div>
          <button class="btn btn--primary save-progress-btn">Save Progress</button>
        </div>
      </div>
    `;
    }

    /**
     * Select a day
     */
    private selectDay(dayIndex: number): void {
        const week = getCurrentWeek(this.currentWeekStart);
        this.selectedDate = week[dayIndex];
        this.updateDayDetails();
    }

    /**
     * Update only the day details section
     */
    private updateDayDetails(): void {
        const bodyEl = this.modal?.querySelector('.progress-tracker-body');
        if (!bodyEl) return;

        const calendarHtml = this.renderWeekCalendar();
        const detailsHtml = this.renderDayDetails();

        bodyEl.innerHTML = calendarHtml + detailsHtml;

        // Re-attach event listeners
        this.modal?.querySelectorAll('.calendar-day').forEach((day, index) => {
            day.addEventListener('click', () => this.selectDay(index));
        });
        this.modal?.querySelector('.week-nav-prev')?.addEventListener('click', () => this.previousWeek());
        this.modal?.querySelector('.week-nav-next')?.addEventListener('click', () => this.nextWeek());
        this.modal?.querySelector('.save-progress-btn')?.addEventListener('click', () => this.saveProgress());
    }

    /**
     * Navigate to previous week
     */
    private previousWeek(): void {
        this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
        this.selectedDate = null;
        this.updateDayDetails();
    }

    /**
     * Navigate to next week
     */
    private nextWeek(): void {
        this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
        this.selectedDate = null;
        this.updateDayDetails();
    }

    /**
     * Save progress for selected day
     */
    private saveProgress(): void {
        if (!this.selectedDate || !this.currentProject) return;

        const doneEl = this.modal?.querySelector('#progress-done') as HTMLTextAreaElement;
        const plannedEl = this.modal?.querySelector('#progress-planned') as HTMLTextAreaElement;

        if (!doneEl || !plannedEl) return;

        const progress: DailyProgress = {
            done: doneEl.value.trim(),
            planned: plannedEl.value.trim(),
        };

        const dateKey = formatDate(this.selectedDate);
        saveDailyProgress(this.currentProject.id, dateKey, progress);

        // Show feedback
        const saveBtn = this.modal?.querySelector('.save-progress-btn');
        if (saveBtn) {
            const originalText = saveBtn.textContent;
            saveBtn.textContent = '✓ Saved!';
            setTimeout(() => {
                if (saveBtn) saveBtn.textContent = originalText;
            }, 2000);
        }

        // Update calendar to show progress indicator
        this.updateDayDetails();
    }
}

// Singleton instance
export const progressTracker = new ProgressTracker();
