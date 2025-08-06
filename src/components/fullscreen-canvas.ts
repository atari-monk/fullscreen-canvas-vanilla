import type { EngineHook } from "zippy-shared-lib";
import type { CanvasResizer } from "../core/canvas-resizer.js";
import type { FullscreenService } from "../core/fullscreen-service.js";
import type { Renderer } from "../core/renderer.js";

export class FullscreenCanvas {
    constructor(
        private fullscreenService: FullscreenService,
        private canvasResizer: CanvasResizer,
        private renderer: Renderer
    ) {
        this.init();
    }

    private init(): void {
        this.canvasResizer.resize();
        this.renderer.start();
    }

    public destroy(): void {
        this.renderer.stop();
        this.fullscreenService.destroy();
        this.canvasResizer.destroy();
    }

    public setEngineHook(strategy: EngineHook): void {
        this.renderer.setEngineHook(strategy);
    }
}
