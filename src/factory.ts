import { FullscreenCanvas } from "./fullscreen-canvas.js";
import type { FrameContext } from "./types/frame-context.js";
import { DefaultRenderStrategy } from "./default-render-strategy.js";
import { RealBrowserEnvironment } from "./real-browser-environment.js";
import { EventSystem } from "./event-system.js";
import { CanvasResizer } from "./canvas-resizer.js";
import { FullscreenService } from "./fullscreen-service.js";
import { Renderer } from "./renderer.js";
import type { FullscreenCanvasOptions } from "./types/fullscreen-canvas-options.js";

export function createGameCanvas(
    containerId: string,
    canvasId: string,
    gameEngine: { frameTick: (context: FrameContext) => void },
    options: FullscreenCanvasOptions = {}
): FullscreenCanvas {
    const mergedOptions = createMergedOptions(gameEngine, options);
    const browser = getBrowserEnvironment(options);
    const eventSystem = new EventSystem(browser);

    const { container, canvas } = getAndValidateElements(
        browser,
        containerId,
        canvasId
    );

    const services = createServices(
        container,
        canvas,
        browser,
        eventSystem,
        mergedOptions
    );

    return new FullscreenCanvas(
        eventSystem,
        services.fullscreenService,
        services.canvasResizer,
        services.renderer
    );
}

function createMergedOptions(
    gameEngine: { frameTick: (context: FrameContext) => void },
    options: FullscreenCanvasOptions
) {
    return {
        loop: true,
        ...options,
        frameTick: gameEngine.frameTick.bind(gameEngine),
    };
}

function getBrowserEnvironment(options: FullscreenCanvasOptions) {
    return options.browserEnvironment || new RealBrowserEnvironment();
}

function getAndValidateElements(
    browser: RealBrowserEnvironment,
    containerId: string,
    canvasId: string
) {
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

    return { container, canvas };
}

function createServices(
    container: HTMLElement,
    canvas: HTMLCanvasElement,
    browser: RealBrowserEnvironment,
    eventSystem: EventSystem,
    options: FullscreenCanvasOptions
) {
    const fullscreenService = new FullscreenService(
        container,
        browser,
        eventSystem
    );

    const canvasResizer = new CanvasResizer(canvas, browser, eventSystem);

    const renderStrategy =
        options.renderStrategy || new DefaultRenderStrategy();
    const renderer = new Renderer(canvas, renderStrategy, options, browser);

    return { fullscreenService, canvasResizer, renderer };
}
