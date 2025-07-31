import type { FrameContext } from "./types/FrameContext.js";
import type { FullscreenCanvasOptions } from "./types/FullscreenCanvasOptions.js";
import { FullscreenService } from "./fullscreen-service.js";

export interface RenderStrategy {
    render(context: FrameContext): void;
}

export class DefaultRenderStrategy implements RenderStrategy {
    render(context: FrameContext) {
        // Default rendering logic - clears the canvas
        context.ctx.clearRect(0, 0, context.width, context.height);
    }
}

export class FullscreenCanvas {
    private canvas: HTMLCanvasElement;
    private container: HTMLElement;
    private fullscreenService: FullscreenService;
    private rafId: number = 0;
    private lastTime: number = 0;
    private totalTime: number = 0;
    private options: FullscreenCanvasOptions;
    private renderStrategy: RenderStrategy;

    constructor(
        containerId: string,
        canvasId: string,
        options: FullscreenCanvasOptions,
        renderStrategy: RenderStrategy = new DefaultRenderStrategy()
    ) {
        const container = document.getElementById(containerId);
        const canvas = document.getElementById(canvasId);

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
        this.fullscreenService = new FullscreenService(this.container);

        this.init();
    }

    private init(): void {
        this.resizeCanvas();
        this.setupEventListeners();

        // Start rendering
        this.lastTime = 0;
        this.totalTime = 0;
        this.rafId = requestAnimationFrame(this.frameTick.bind(this));
    }

    private resizeCanvas(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.canvas.width = width;
        this.canvas.height = height;
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
            this.rafId = requestAnimationFrame(this.frameTick.bind(this));
        }
    }

    private setupEventListeners(): void {
        window.addEventListener("resize", this.handleResize.bind(this), {
            passive: true,
        });
    }

    private handleResize(): void {
        this.resizeCanvas();
    }

    public destroy(): void {
        window.removeEventListener("resize", this.handleResize.bind(this));
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        this.fullscreenService.destroy();
    }

    // Allow changing the render strategy at runtime
    public setRenderStrategy(strategy: RenderStrategy): void {
        this.renderStrategy = strategy;
    }
}
