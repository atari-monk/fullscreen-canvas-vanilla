import type { FullscreenCanvasOptions } from "./types/fullscreen-canvas-options.js";
import { FullscreenService } from "./fullscreen-service.js";
import type { RenderStrategy } from "./types/render-strategy.js";
import { DefaultRenderStrategy } from "./default-render-strategy.js";
import { CanvasResizer } from "./canvas-resizer.js";
import type { BrowserEnvironment } from "./types/browser-environment.js";
import { RealBrowserEnvironment } from "./real-browser-environment.js";
import { EventSystem } from "./event-system.js";
import { Renderer } from "./renderer.js";

export class FullscreenCanvas {
    private canvas: HTMLCanvasElement;
    private container: HTMLElement;
    private fullscreenService: FullscreenService;
    private options: FullscreenCanvasOptions;
    private renderStrategy: RenderStrategy;
    private canvasResizer: CanvasResizer;
    private browser: BrowserEnvironment;
    private eventSystem: EventSystem;
    private renderer: Renderer;

    constructor(
        containerId: string,
        canvasId: string,
        options: FullscreenCanvasOptions,
        renderStrategy: RenderStrategy = new DefaultRenderStrategy(),
        browser: BrowserEnvironment = new RealBrowserEnvironment()
    ) {
        this.browser = browser;
        this.eventSystem = new EventSystem(browser);
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
        this.renderer = new Renderer(
            this.canvas,
            this.renderStrategy,
            this.options,
            this.browser
        );

        this.init();
    }

    private init(): void {
        this.resizeCanvas();
        this.setupEventListeners();
        this.renderer.start();
    }

    private resizeCanvas(): void {
        this.canvasResizer.resize();
    }

    private setupEventListeners(): void {
        this.eventSystem.add("window", "resize", this.handleResize.bind(this), {
            passive: true,
        });
    }

    private handleResize(): void {
        this.resizeCanvas();
    }

    public destroy(): void {
        this.eventSystem.removeAll();
        this.renderer.stop();
        this.fullscreenService.destroy();
    }

    public setRenderStrategy(strategy: RenderStrategy): void {
        this.renderStrategy = strategy;
        this.renderer.setRenderStrategy(strategy);
    }
}
