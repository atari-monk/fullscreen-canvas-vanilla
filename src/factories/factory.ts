import type { EngineHook } from "zippy-shared-lib";
import type { FullscreenCanvasOptions } from "../interfaces/fullscreen-canvas-options.js";
import { CanvasResizer } from "../core/canvas-resizer.js";
import { FullscreenService } from "../core/fullscreen-service.js";
import { Renderer } from "../core/renderer.js";
import { TimeCalculator } from "../core/time-calculator.js";
import { FullscreenCanvas } from "../components/fullscreen-canvas.js";

export function createGameCanvas(
    containerId: string,
    canvasId: string,
    engineHook: EngineHook,
    options: FullscreenCanvasOptions = {}
): FullscreenCanvas {
    const mergedOptions = createMergedOptions(options);

    const { container, canvas } = getAndValidateElements(containerId, canvasId);

    const timeCalculator = new TimeCalculator();
    const services = createServices(
        container,
        canvas,
        mergedOptions,
        timeCalculator,
        engineHook
    );

    return new FullscreenCanvas(
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

function getAndValidateElements(containerId: string, canvasId: string) {
    const container = document.getElementById(containerId);
    const canvas = document.getElementById(canvasId);

    if (!container)
        throw new Error(`Container with ID ${containerId} not found`);
    if (!canvas) throw new Error(`Canvas with ID ${canvasId} not found`);
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error(`Element with ID ${canvasId} is not a canvas`);
    }

    return { container, canvas };
}

function createServices(
    container: HTMLElement,
    canvas: HTMLCanvasElement,
    options: FullscreenCanvasOptions,
    timeCalculator: TimeCalculator,
    engineHook: EngineHook
) {
    const fullscreenService = new FullscreenService(container);

    const canvasResizer = new CanvasResizer(canvas);

    const renderer = new Renderer(canvas, engineHook, options, timeCalculator);

    return { fullscreenService, canvasResizer, renderer };
}
