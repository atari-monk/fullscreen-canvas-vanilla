import type { BrowserEnvironment } from "./types/browser-environment.js";
import type { FrameContext } from "./types/frame-context.js";
import type { FullscreenCanvasOptions } from "./types/fullscreen-canvas-options.js";
import type { EngineHook as EngineHook } from "./types/engine-hook.js";
import type { TimeCalculator } from "./time-calculator.js";

export class Renderer {
    private rafId: number = 0;
    private isRunning: boolean = false;

    constructor(
        private canvas: HTMLCanvasElement,
        private engineHook: EngineHook,
        private options: FullscreenCanvasOptions,
        private browser: BrowserEnvironment,
        private timeCalculator: TimeCalculator
    ) {}

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
        const ctx = this.canvas.getContext("2d");
        if (!ctx) return;

        const { deltaTime, totalTime } = this.timeCalculator.calculate(time);

        const context: FrameContext = {
            ctx,
            width: this.canvas.width,
            height: this.canvas.height,
            deltaTime,
            totalTime,
        };

        ctx.clearRect(0, 0, context.width, context.height);
        this.engineHook.frameTick(context);

        if (this.options.loop && this.isRunning) {
            this.rafId = this.browser.requestAnimationFrame(
                this.frameTick.bind(this)
            );
        }
    }
}
