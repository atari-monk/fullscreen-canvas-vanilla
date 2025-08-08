import type { EngineHook } from "zippy-shared-lib";
import type { FullscreenCanvasOptions } from "../interfaces/fullscreen-canvas-options.js";
import { CanvasResizer } from "../core/canvas-resizer.js";
import { Renderer } from "../core/renderer.js";
import { TimeCalculator } from "../core/time-calculator.js";
import { FullscreenCanvas } from "../components/fullscreen-canvas.js";
import { FullscreenButton } from "../components/fullscreen-button.js";

export function createGameCanvas(
    containerId: string,
    canvasId: string,
    engineHook: EngineHook,
    options: FullscreenCanvasOptions = {}
): FullscreenCanvas {
    const { container, canvas } = getAndValidateElements(containerId, canvasId);
    return createComponents(
        container,
        createServices(canvas, createMergedOptions(options), engineHook)
    );
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

function createComponents(
    container: HTMLElement,
    services: { canvasResizer: CanvasResizer; renderer: Renderer }
) {
    return new FullscreenCanvas(
        new FullscreenButton(container),
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

function createServices(
    canvas: HTMLCanvasElement,
    options: FullscreenCanvasOptions,
    engineHook: EngineHook
) {
    return {
        canvasResizer: new CanvasResizer(canvas),
        renderer: new Renderer(
            canvas,
            engineHook,
            options,
            new TimeCalculator()
        ),
    };
}
