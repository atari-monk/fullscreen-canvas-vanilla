export class FullscreenService {
    private container: HTMLElement;
    private button: HTMLButtonElement;
    private isTouchDevice: boolean;
    private fullscreenChangeHandler: () => void;
    private buttonClickHandler: () => void;

    constructor(container: HTMLElement) {
        this.container = container;
        this.isTouchDevice = this.isTouchDeviceCheck();
        this.button = this.createFullscreenButton();
        this.fullscreenChangeHandler = this.updateButtonVisibility.bind(this);
        this.buttonClickHandler = this.handleFullscreenToggle.bind(this);
        this.setupEventListeners();
        this.updateButtonVisibility();
    }

    public destroy(): void {
        document.removeEventListener(
            "fullscreenchange",
            this.fullscreenChangeHandler
        );
        this.button.removeEventListener("click", this.buttonClickHandler);
        this.button.remove();
    }

    private createFullscreenButton(): HTMLButtonElement {
        const button = document.createElement("button");
        button.className = "fullscreen-button";
        button.textContent = "Enter Fullscreen";
        this.container.appendChild(button);
        return button;
    }

    private async handleFullscreenToggle(): Promise<void> {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await this.container.requestFullscreen();
            }
        } catch (error) {
            console.error("Fullscreen error:", error);
        }
    }

    private setupEventListeners(): void {
        document.addEventListener(
            "fullscreenchange",
            this.fullscreenChangeHandler
        );
        this.button.addEventListener("click", this.buttonClickHandler);
    }

    private updateButtonVisibility(): void {
        const isFullscreen = document.fullscreenElement !== null;
        this.button.textContent = isFullscreen
            ? "Exit Fullscreen"
            : "Enter Fullscreen";
        this.button.classList.toggle(
            "visible",
            this.isTouchDevice && !isFullscreen
        );
    }

    private isTouchDeviceCheck(): boolean {
        if (typeof window === "undefined") return false;
        return (
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia("(pointer: coarse)").matches
        );
    }
}
