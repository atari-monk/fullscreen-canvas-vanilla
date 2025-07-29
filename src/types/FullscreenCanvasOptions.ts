import type { FrameContext } from "./FrameContext.js";

export interface FullscreenCanvasOptions {
    frameTick: (context: FrameContext) => void;
    loop?: boolean;
}
