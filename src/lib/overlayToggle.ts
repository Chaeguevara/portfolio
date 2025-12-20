/**
 * @fileoverview Overlay toggle utility for work detail panels.
 * Centralizes the toggle logic and keyboard listener setup.
 */

/** State for tracking current overlay cleanup function. */
let currentCleanup: (() => void) | null = null;

/**
 * Initializes overlay toggle for a work detail overlay.
 * @param overlayId - DOM ID of the overlay element.
 * @param buttonId - DOM ID of the toggle button.
 * @returns Cleanup function to remove listeners.
 */
export function initOverlayToggle(
    overlayId: string = 'work-details-overlay',
    buttonId: string = 'info-toggle'
): () => void {
    // Clean up previous instance if any
    if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
    }

    const overlay = document.getElementById(overlayId);
    const button = document.getElementById(buttonId);

    const toggle = () => {
        if (!overlay) return;
        const isHidden = overlay.style.opacity === '0';
        overlay.style.opacity = isHidden ? '1' : '0';
        overlay.style.pointerEvents = isHidden ? 'auto' : 'none';
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'h') toggle();
    };

    // Bind listeners
    if (button) button.addEventListener('click', toggle);
    window.addEventListener('keydown', onKeyDown);

    // Return cleanup function
    const cleanup = () => {
        if (button) button.removeEventListener('click', toggle);
        window.removeEventListener('keydown', onKeyDown);
    };

    currentCleanup = cleanup;
    return cleanup;
}
