import type { CanvasResizer } from "../core/canvas-resizer.js";
import type { FullscreenButton } from "../components/fullscreen-button.js";
import type { Renderer } from "../core/renderer.js";

export class FullscreenCanvas {
    constructor(
        private fullscreenButton: FullscreenButton,
        private canvasResizer: CanvasResizer,
        private renderer: Renderer
    ) {
        this.canvasResizer.resize();
        this.renderer.start();
    }

    public destroy(): void {
        this.renderer.stop();
        this.fullscreenButton.destroy();
        this.canvasResizer.destroy();
    }
}
