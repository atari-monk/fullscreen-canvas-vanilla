import type { FrameContext } from "./frame-context.js";

export interface FullscreenCanvasOptions {
    frameTick: (context: FrameContext) => void;
    loop?: boolean;
}
