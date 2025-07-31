import type { BrowserEnvironment } from "./types/browser-environment.js";

export class CanvasResizer {
    private browser: BrowserEnvironment;

    constructor(
        private canvas: HTMLCanvasElement,
        browser: BrowserEnvironment
    ) {
        this.browser = browser;
    }

    resize() {
        const { width, height } = this.browser.getWindowDimensions();
        this.canvas.width = width;
        this.canvas.height = height;
    }
}
