import type { RenderStrategy } from "./types/render-strategy.js";
import type { FrameContext } from "./types/frame-context.js";

export class DefaultRenderStrategy implements RenderStrategy {
    render(context: FrameContext) {
        // Default rendering logic - clears the canvas
        context.ctx.clearRect(0, 0, context.width, context.height);
    }
}
