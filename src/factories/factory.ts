import type {
    BrowserEnvironment,
    EventSystem,
    EngineHook,
} from "zippy-shared-lib";
import type { FullscreenCanvasOptions } from "../interfaces/fullscreen-canvas-options.js";
import { CanvasResizer } from "../core/canvas-resizer.js";
import { FullscreenService } from "../core/fullscreen-service.js";
import { Renderer } from "../core/renderer.js";
import { TimeCalculator } from "../core/time-calculator.js";
import { FullscreenCanvas } from "../components/fullscreen-canvas.js";

export function createGameCanvas(
    containerId: string,
    canvasId: string,
    eventSystem: EventSystem,
    browserEnvironment: BrowserEnvironment,
    engineHook: EngineHook,
    options: FullscreenCanvasOptions = {}
): FullscreenCanvas {
    const mergedOptions = createMergedOptions(options);

    const { container, canvas } = getAndValidateElements(
        browserEnvironment,
        containerId,
        canvasId
    );

    const timeCalculator = new TimeCalculator();
    const services = createServices(
        container,
        canvas,
        browserEnvironment,
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

function getAndValidateElements(
    browserEnvironment: BrowserEnvironment,
    containerId: string,
    canvasId: string
) {
    const container = browserEnvironment.getElementById(containerId);
    const canvas = browserEnvironment.getElementById(canvasId);

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
    browserEnvironment: BrowserEnvironment,
    eventSystem: EventSystem,
    options: FullscreenCanvasOptions,
    timeCalculator: TimeCalculator,
    engineHook: EngineHook
) {
    const fullscreenService = new FullscreenService(
        container,
        browserEnvironment,
        eventSystem
    );

    const canvasResizer = new CanvasResizer(canvas, browserEnvironment, eventSystem);

    const renderer = new Renderer(
        canvas,
        engineHook,
        options,
        browserEnvironment,
        timeCalculator
    );

    return { fullscreenService, canvasResizer, renderer };
}
