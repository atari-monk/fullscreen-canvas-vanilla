import { FullscreenCanvas } from "./fullscreen-canvas.js";
import type { FrameContext } from "./types/frame-context.js";
import { DefaultRenderStrategy } from "./default-render-strategy.js";
import { RealBrowserEnvironment } from "./real-browser-environment.js";
import { EventSystem } from "./event-system.js";
import { CanvasResizer } from "./canvas-resizer.js";
import { FullscreenService } from "./fullscreen-service.js";
import { Renderer } from "./renderer.js";
import type { GameCanvasOptions } from "./types/game-canvas-options.js";

export function createGameCanvas(
    containerId: string,
    canvasId: string,
    gameEngine: { frameTick: (context: FrameContext) => void },
    options: GameCanvasOptions = {}
): FullscreenCanvas {
    const defaults = {
        loop: true,
    };

    const mergedOptions = {
        ...defaults,
        ...options,
        frameTick: gameEngine.frameTick.bind(gameEngine),
    };

    // Create dependencies
    const browser = options.browserEnvironment || new RealBrowserEnvironment();
    const eventSystem = new EventSystem(browser);
    const renderStrategy =
        options.renderStrategy || new DefaultRenderStrategy();

    // Get DOM elements
    const container = browser.getElementById(containerId);
    const canvas = browser.getElementById(canvasId);

    if (!container || !canvas) {
        throw new Error(
            `Could not find elements with IDs ${containerId} and ${canvasId}`
        );
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error(`Element with ID ${canvasId} is not a canvas`);
    }

    // Create services
    const fullscreenService = new FullscreenService(
        container,
        browser,
        eventSystem
    );
    const canvasResizer = new CanvasResizer(canvas, browser, eventSystem);
    const renderer = new Renderer(
        canvas,
        renderStrategy,
        mergedOptions,
        browser
    );

    return new FullscreenCanvas(
        eventSystem,
        fullscreenService,
        canvasResizer,
        renderer
    );
}
