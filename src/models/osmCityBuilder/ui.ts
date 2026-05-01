/**
 * @fileoverview UI components for OSM City Builder.
 * Handles UI panel, address input, and loading overlay.
 */

/**
 * UI component references for external control.
 */
export interface UIComponents {
    uiPanel: HTMLDivElement;
    addressInput: HTMLInputElement;
    loadButton: HTMLButtonElement;
    loadingOverlay: HTMLDivElement;
    loadingText: HTMLDivElement;
}

/**
 * Create the main UI panel with address input.
 */
export function createUIPanel(
    onLoadClick: (address: string) => void,
    defaultAddress: string = '서울특별시 강남구 영동대로 517'
): { uiPanel: HTMLDivElement; addressInput: HTMLInputElement; loadButton: HTMLButtonElement } {
    const uiPanel = document.createElement('div');
    uiPanel.style.position = 'absolute';
    uiPanel.style.top = '20px';
    uiPanel.style.left = '20px';
    uiPanel.style.padding = '15px';
    uiPanel.style.background = 'rgba(0, 0, 0, 0.7)';
    uiPanel.style.color = 'white';
    uiPanel.style.borderRadius = '8px';
    uiPanel.style.fontFamily = 'Inter, sans-serif';
    uiPanel.style.fontSize = '14px';
    uiPanel.style.zIndex = '1000';
    uiPanel.style.minWidth = '300px';

    const title = document.createElement('div');
    title.textContent = 'OSM City Builder';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '10px';
    title.style.fontSize = '16px';
    uiPanel.appendChild(title);

    const addressInput = document.createElement('input');
    addressInput.type = 'text';
    addressInput.placeholder = 'Enter address or place...';
    addressInput.value = defaultAddress;
    addressInput.style.width = '100%';
    addressInput.style.padding = '8px';
    addressInput.style.marginBottom = '10px';
    addressInput.style.border = 'none';
    addressInput.style.borderRadius = '4px';
    addressInput.style.fontSize = '14px';
    addressInput.style.boxSizing = 'border-box';
    uiPanel.appendChild(addressInput);

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load Buildings';
    loadButton.style.width = '100%';
    loadButton.style.padding = '8px';
    loadButton.style.background = '#4CAF50';
    loadButton.style.color = 'white';
    loadButton.style.border = 'none';
    loadButton.style.borderRadius = '4px';
    loadButton.style.cursor = 'pointer';
    loadButton.style.fontSize = '14px';
    loadButton.style.fontWeight = 'bold';
    loadButton.addEventListener('click', () => {
        const address = addressInput.value.trim();
        if (address) {
            onLoadClick(address);
        }
    });
    uiPanel.appendChild(loadButton);

    const statusDiv = document.createElement('div');
    statusDiv.style.marginTop = '10px';
    statusDiv.style.fontSize = '12px';
    statusDiv.style.color = '#aaa';
    statusDiv.textContent = 'Press "e" to export STL | Click buildings to highlight';
    uiPanel.appendChild(statusDiv);

    return { uiPanel, addressInput, loadButton };
}

/**
 * Create loading overlay with spinner.
 */
export function createLoadingOverlay(): { loadingOverlay: HTMLDivElement; loadingText: HTMLDivElement } {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        flex-direction: column;
    `;

    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 4px solid #333;
        border-top: 4px solid #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;

    const loadingText = document.createElement('div');
    loadingText.style.cssText = `
        color: #fff;
        margin-top: 15px;
        font-size: 14px;
    `;
    loadingText.textContent = 'Loading city data...';

    loadingOverlay.appendChild(spinner);
    loadingOverlay.appendChild(loadingText);

    return { loadingOverlay, loadingText };
}

/**
 * Add CSS animation for spinner to document head.
 */
export function addSpinnerAnimation(): void {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Show loading overlay with custom message.
 */
export function showLoading(
    loadingOverlay: HTMLDivElement,
    loadingText: HTMLDivElement,
    message: string = 'Loading city data...'
): void {
    loadingText.textContent = message;
    loadingOverlay.style.display = 'flex';
}

/**
 * Hide loading overlay.
 */
export function hideLoading(loadingOverlay: HTMLDivElement): void {
    loadingOverlay.style.display = 'none';
}

/**
 * Initialize all UI components.
 */
export function initializeUI(
    mount: HTMLElement,
    onLoadClick: (address: string) => void,
    defaultAddress?: string
): UIComponents {
    const { uiPanel, addressInput, loadButton } = createUIPanel(onLoadClick, defaultAddress);
    const { loadingOverlay, loadingText } = createLoadingOverlay();

    addSpinnerAnimation();
    mount.appendChild(loadingOverlay);
    mount.appendChild(uiPanel);

    return {
        uiPanel,
        addressInput,
        loadButton,
        loadingOverlay,
        loadingText
    };
}
