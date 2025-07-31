import type { BrowserEnvironment } from "./browser-environment.js";
import type { RenderStrategy } from "./render-strategy.js";

export interface GameCanvasOptions {
    loop?: boolean;
    renderStrategy?: RenderStrategy;
    browserEnvironment?: BrowserEnvironment;
}
