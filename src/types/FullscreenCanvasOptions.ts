import type { RenderContext } from "../types/RenderContext.js";

export interface FullscreenCanvasOptions {
    render: (context: RenderContext) => void;
    loop?: boolean;
}
