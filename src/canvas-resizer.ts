import type { BrowserEnvironment } from "./types/browser-environment.js";
import { EventSystem } from "./event-system.js";

export class CanvasResizer {
    constructor(
        private canvas: HTMLCanvasElement,
        private browser: BrowserEnvironment,
        private eventSystem: EventSystem
    ) {
        this.setupEventListeners();
    }

    resize() {
        const { width, height } = this.browser.getWindowDimensions();
        this.canvas.width = width;
        this.canvas.height = height;
    }

    private setupEventListeners(): void {
        this.eventSystem.add("window", "resize", this.handleResize.bind(this), {
            passive: true,
        });
    }

    private handleResize(): void {
        this.resize();
    }

    public destroy(): void {
        this.eventSystem.removeAll();
    }
}
