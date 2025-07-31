import { FullscreenCanvas } from "./fullscreen-canvas.js";
import { RealBrowserEnvironment } from "./real-browser-environment.js";
import { EventSystem } from "./event-system.js";
import { CanvasResizer } from "./canvas-resizer.js";
import { FullscreenService } from "./fullscreen-service.js";
import { Renderer } from "./renderer.js";
import type { FullscreenCanvasOptions } from "./types/fullscreen-canvas-options.js";
import type { EngineHook } from "./types/engine-hook.js";
import { TimeCalculator } from "./time-calculator.js";

export function createGameCanvas(
    containerId: string,
    canvasId: string,
    engineHook: EngineHook,
    options: FullscreenCanvasOptions = {}
): FullscreenCanvas {
    const mergedOptions = createMergedOptions(options);
    const browser = getBrowserEnvironment();
    const eventSystem = new EventSystem(browser);

    const { container, canvas } = getAndValidateElements(
        browser,
        containerId,
        canvasId
    );

    const timeCalculator = new TimeCalculator();
    const services = createServices(
        container,
        canvas,
        browser,
        eventSystem,
        mergedOptions,
        timeCalculator,
        engineHook
    );

    return new FullscreenCanvas(
        eventSystem,
        services.fullscreenService,
        services.canvasResizer,
        services.renderer
    );
}

function createMergedOptions(options: FullscreenCanvasOptions) {
    return {
        loop: true,
        ...options,
    };
}

function getBrowserEnvironment() {
    return new RealBrowserEnvironment();
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
    options: FullscreenCanvasOptions,
    timeCalculator: TimeCalculator,
    engineHook: EngineHook
) {
    const fullscreenService = new FullscreenService(
        container,
        browser,
        eventSystem
    );

    const canvasResizer = new CanvasResizer(canvas, browser, eventSystem);

    const renderer = new Renderer(
        canvas,
        engineHook,
        options,
        browser,
        timeCalculator
    );

    return { fullscreenService, canvasResizer, renderer };
}
