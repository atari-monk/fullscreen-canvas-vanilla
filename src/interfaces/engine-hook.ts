import type { FrameContext } from "zippy-shared-lib";

export interface EngineHook {
    frameTick(context: FrameContext): void;
}
