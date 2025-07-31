export class FullscreenService {
    private container: HTMLElement;
    private button: HTMLButtonElement;
    private isTouchDevice: boolean;

    constructor(container: HTMLElement) {
        this.container = container;
        this.button = this.createFullscreenButton();
        this.isTouchDevice = this.detectTouchDevice();
        this.setupEventListeners();
    }

    private createFullscreenButton(): HTMLButtonElement {
        const button = document.createElement("button");
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
        document.addEventListener(
            "fullscreenchange",
            this.handleFullscreenChange.bind(this)
        );
        this.button.addEventListener("click", this.enterFullscreen.bind(this));
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
        document.removeEventListener(
            "fullscreenchange",
            this.handleFullscreenChange.bind(this)
        );
        this.button.removeEventListener(
            "click",
            this.enterFullscreen.bind(this)
        );
        this.button.remove();
    }
}
