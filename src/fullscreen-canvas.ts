import type { FrameContext } from "./types/frame-context.js";
import type { FullscreenCanvasOptions } from "./types/fullscreen-canvas-options.js";
import { FullscreenService } from "./fullscreen-service.js";
import type { RenderStrategy } from "./types/render-strategy.js";
import { DefaultRenderStrategy } from "./default-render-strategy.js";
import { CanvasResizer } from "./canvas-resizer.js";
import type { BrowserEnvironment } from "./types/browser-environment.js";
import { RealBrowserEnvironment } from "./real-browser-environment.js";

export class FullscreenCanvas {
    private canvas: HTMLCanvasElement;
    private container: HTMLElement;
    private fullscreenService: FullscreenService;
    private rafId: number = 0;
    private lastTime: number = 0;
    private totalTime: number = 0;
    private options: FullscreenCanvasOptions;
    private renderStrategy: RenderStrategy;
    private canvasResizer: CanvasResizer;
    private browser: BrowserEnvironment;

    constructor(
        containerId: string,
        canvasId: string,
        options: FullscreenCanvasOptions,
        renderStrategy: RenderStrategy = new DefaultRenderStrategy(),
        browser: BrowserEnvironment = new RealBrowserEnvironment()
    ) {
        this.browser = browser;
        const container = this.browser.getElementById(containerId);
        const canvas = this.browser.getElementById(canvasId);

        if (!container || !canvas) {
            throw new Error(
                `Could not find elements with IDs ${containerId} and ${canvasId}`
            );
        }

        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error(`Element with ID ${canvasId} is not a canvas`);
        }

        this.container = container;
        this.canvas = canvas;
        this.options = options;
        this.renderStrategy = renderStrategy;
        this.fullscreenService = new FullscreenService(
            this.container,
            this.browser
        );
        this.canvasResizer = new CanvasResizer(this.canvas, this.browser);

        this.init();
    }

    private init(): void {
        this.resizeCanvas();
        this.setupEventListeners();

        // Start rendering
        this.lastTime = 0;
        this.totalTime = 0;
        this.rafId = this.browser.requestAnimationFrame(
            this.frameTick.bind(this)
        );
    }

    private resizeCanvas(): void {
        this.canvasResizer.resize();
    }

    private frameTick(time: number): void {
        const ctx = this.canvas.getContext("2d");
        if (!ctx) return;

        if (this.lastTime === 0) {
            this.lastTime = time;
        }
        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;
        this.totalTime += deltaTime;

        const context: FrameContext = {
            ctx,
            width: this.canvas.width,
            height: this.canvas.height,
            deltaTime,
            totalTime: this.totalTime,
        };

        this.renderStrategy.render(context);
        this.options.frameTick(context);

        if (this.options.loop) {
            this.rafId = this.browser.requestAnimationFrame(
                this.frameTick.bind(this)
            );
        }
    }

    private setupEventListeners(): void {
        this.browser.addEventListener(
            "window",
            "resize",
            this.handleResize.bind(this),
            { passive: true }
        );
    }

    private handleResize(): void {
        this.resizeCanvas();
    }

    public destroy(): void {
        this.browser.removeEventListener(
            "window",
            "resize",
            this.handleResize.bind(this)
        );
        if (this.rafId) {
            this.browser.cancelAnimationFrame(this.rafId);
        }
        this.fullscreenService.destroy();
    }

    public setRenderStrategy(strategy: RenderStrategy): void {
        this.renderStrategy = strategy;
    }
}
