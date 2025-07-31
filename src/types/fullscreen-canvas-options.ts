import type { BrowserEnvironment } from "./browser-environment.js";
import type { FrameContext } from "./frame-context.js";
import type { RenderStrategy } from "./render-strategy.js";

export interface FullscreenCanvasOptions {
    loop?: boolean;
    frameTick?: (context: FrameContext) => void;
    renderStrategy?: RenderStrategy;
    browserEnvironment?: BrowserEnvironment;
}
