import { FullscreenCanvas } from "./fullscreen-canvas.js";
import type { FrameContext } from "./types/frame-context.js";

interface GameCanvasOptions {
    loop?: boolean;
    // Add other FullscreenCanvas options here as needed
}

export function createGameCanvas(
    containerId: string,
    canvasId: string,
    gameEngine: { frameTick: (context: FrameContext) => void },
    options: GameCanvasOptions = {}
): FullscreenCanvas {
    const defaults = {
        loop: true,
        // Add other default options here
    };

    return new FullscreenCanvas(containerId, canvasId, {
        frameTick: gameEngine.frameTick.bind(gameEngine),
        ...defaults,
        ...options,
    });
}

// Usage :
// const gameCanvas = createGameCanvas(
//     "canvas-container",
//     "game-canvas",
//     gameEngine
//     // loop: true is now the default
// );
