import type { FrameContext } from "./frame-context.js";

export interface RenderStrategy {
    render(context: FrameContext): void;
}
