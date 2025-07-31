import type { BrowserEnvironment } from "../interfaces/browser-environment.js";
import type { EventSystem } from "./event-system.js";

export class FullscreenService {
    private container: HTMLElement;
    private button: HTMLButtonElement;
    private isTouchDevice: boolean;
    private browser: BrowserEnvironment;
    private eventSystem: EventSystem;

    constructor(
        container: HTMLElement,
        browser: BrowserEnvironment,
        eventSystem: EventSystem
    ) {
        this.container = container;
        this.browser = browser;
        this.eventSystem = eventSystem;
        this.button = this.createFullscreenButton();
        this.isTouchDevice = this.detectTouchDevice();
        this.setupEventListeners();
    }

    private createFullscreenButton(): HTMLButtonElement {
        const button = this.browser.createElement(
            "button"
        ) as HTMLButtonElement;
        button.className = "fullscreen-button";
        button.textContent = "Enter Fullscreen";
        this.container.appendChild(button);
        return button;
    }

    private detectTouchDevice(): boolean {
        return (
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            (navigator as any).msMaxTouchPoints > 0
        );
    }

    private setupEventListeners(): void {
        this.eventSystem.add(
            "document",
            "fullscreenchange",
            this.handleFullscreenChange.bind(this)
        );
        this.eventSystem.add(
            this.button,
            "click",
            this.enterFullscreen.bind(this)
        );
    }

    private handleFullscreenChange(): void {
        this.updateButtonVisibility();
    }

    private updateButtonVisibility(): void {
        const isFullscreen = document.fullscreenElement !== null;
        this.button.classList.toggle(
            "visible",
            this.isTouchDevice && !isFullscreen
        );
    }

    private enterFullscreen(): void {
        if (this.container.requestFullscreen) {
            this.container.requestFullscreen().catch((err) => {
                console.error("Error attempting to enable fullscreen:", err);
            });
        } else if ((this.container as any).webkitRequestFullscreen) {
            (this.container as any).webkitRequestFullscreen();
        } else if ((this.container as any).msRequestFullscreen) {
            (this.container as any).msRequestFullscreen();
        }
    }

    public destroy(): void {
        this.eventSystem.removeAll();
        this.button.remove();
    }
}
