import type { FrameContext } from "./frame-context.js";

export interface EngineHook {
    frameTick(context: FrameContext): void;
}
