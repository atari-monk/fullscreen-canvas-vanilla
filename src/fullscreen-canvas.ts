import type { CanvasResizer } from "./canvas-resizer.js";
import type { EventSystem } from "./event-system.js";
import type { FullscreenService } from "./fullscreen-service.js";
import type { Renderer } from "./renderer.js";
import type { RenderStrategy } from "./types/render-strategy.js";

export class FullscreenCanvas {
    constructor(
        private eventSystem: EventSystem,
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
        this.eventSystem.removeAll();
    }

    public setRenderStrategy(strategy: RenderStrategy): void {
        this.renderer.setRenderStrategy(strategy);
    }
}
