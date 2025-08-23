import type { FrameContext, EngineHook } from "zippy-shared-lib";
import type { FullscreenCanvasOptions } from "../interfaces/fullscreen-canvas-options.js";
import type { TimeCalculator } from "../core/time-calculator.js";

export class Renderer {
    private rafId: number = 0;
    private isRunning: boolean = false;
    private ctx: CanvasRenderingContext2D;

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private engineHook: EngineHook,
        private readonly options: FullscreenCanvasOptions,
        private readonly timeCalculator: TimeCalculator
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
        this.rafId = requestAnimationFrame(this.frameTick.bind(this));
    }

    public stop(): void {
        if (!this.isRunning) return;
        this.isRunning = false;
        cancelAnimationFrame(this.rafId);
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

        if (this.options.isAnimLoop && this.isRunning) {
           this.rafId = requestAnimationFrame(this.frameTick.bind(this));
        }
    }
}
