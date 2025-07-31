export interface BrowserEnvironment {
    getElementById(id: string): HTMLElement | null;
    createElement(tag: string): HTMLElement;
    addEventListener(
        target: "window" | "document",
        event: string,
        callback: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener(
        target: "window" | "document",
        event: string,
        callback: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void;
    requestAnimationFrame(callback: FrameRequestCallback): number;
    cancelAnimationFrame(handle: number): void;
    getWindowDimensions(): { width: number; height: number };
    isFullscreen(): boolean;
    requestFullscreen(element: HTMLElement): Promise<void>;
    exitFullscreen(): void;
    isTouchDevice(): boolean;
}
