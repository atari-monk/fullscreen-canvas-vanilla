import type { BrowserEnvironment } from "../interfaces/browser-environment.js";
import type { FullscreenCanvasOptions } from "../interfaces/fullscreen-canvas-options.js";
import type { FrameContext } from "../interfaces/frame-context.js";
import type { EngineHook } from "../interfaces/engine-hook.js";
import type { TimeCalculator } from "../core/time-calculator.js";

export class Renderer {
    private rafId: number = 0;
    private isRunning: boolean = false;
    private ctx: CanvasRenderingContext2D;

    constructor(
        private canvas: HTMLCanvasElement,
        private engineHook: EngineHook,
        private options: FullscreenCanvasOptions,
        private browser: BrowserEnvironment,
        private timeCalculator: TimeCalculator
    ) {
        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            throw new Error(
                "Failed to get 2D rendering context. Canvas may be unsupported."
            );
        }
        this.ctx = ctx;
    }

    public start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.timeCalculator.reset();
        this.rafId = this.browser.requestAnimationFrame(
            this.frameTick.bind(this)
        );
    }

    public stop(): void {
        if (!this.isRunning) return;
        this.isRunning = false;
        this.browser.cancelAnimationFrame(this.rafId);
    }

    public setEngineHook(strategy: EngineHook): void {
        this.engineHook = strategy;
    }

    private frameTick(time: number): void {
        const { deltaTime, totalTime } = this.timeCalculator.calculate(time);

        const context: FrameContext = {
            ctx: this.ctx,
            width: this.canvas.width,
            height: this.canvas.height,
            deltaTime,
            totalTime,
        };

        this.ctx.clearRect(0, 0, context.width, context.height);
        this.engineHook.frameTick(context);

        if (this.options.loop && this.isRunning) {
            this.rafId = this.browser.requestAnimationFrame(
                this.frameTick.bind(this)
            );
        }
    }
}
