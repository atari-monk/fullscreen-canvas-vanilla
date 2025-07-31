import type { BrowserEnvironment } from "../interfaces/browser-environment.js";

export class RealBrowserEnvironment implements BrowserEnvironment {
    getElementById(id: string): HTMLElement | null {
        return document.getElementById(id);
    }

    createElement(tag: string): HTMLElement {
        return document.createElement(tag);
    }

    addEventListener(
        target: "window" | "document",
        event: string,
        callback: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void {
        const t = target === "window" ? window : document;
        t.addEventListener(event, callback, options);
    }

    removeEventListener(
        target: "window" | "document",
        event: string,
        callback: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void {
        const t = target === "window" ? window : document;
        t.removeEventListener(event, callback, options);
    }

    requestAnimationFrame(callback: FrameRequestCallback): number {
        return window.requestAnimationFrame(callback);
    }

    cancelAnimationFrame(handle: number): void {
        window.cancelAnimationFrame(handle);
    }

    getWindowDimensions(): { width: number; height: number } {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }

    isFullscreen(): boolean {
        return document.fullscreenElement !== null;
    }

    async requestFullscreen(element: HTMLElement): Promise<void> {
        if (element.requestFullscreen) {
            return element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
            return (element as any).webkitRequestFullscreen();
        } else if ((element as any).msRequestFullscreen) {
            return (element as any).msRequestFullscreen();
        }
        throw new Error("Fullscreen API not supported");
    }

    exitFullscreen(): void {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen();
        }
    }

    isTouchDevice(): boolean {
        return (
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            (navigator as any).msMaxTouchPoints > 0
        );
    }
}
