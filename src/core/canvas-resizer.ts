export class CanvasResizer {
    private resizeObserver: ResizeObserver | null = null;
    private resizeTimer: number | null = null;
    private lastDimensions = { width: 0, height: 0 };
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        // Set canvas to fill its container using CSS
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";

        this.setupEventListeners();
        this.resize();
    }

    public resize(): void {
        // Get the *visual* dimensions of the canvas element from the browser
        const rect = this.canvas.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio || 1;
        const width = Math.floor(rect.width * pixelRatio);
        const height = Math.floor(rect.height * pixelRatio);

        if (
            width !== this.lastDimensions.width ||
            height !== this.lastDimensions.height
        ) {
            // Only resize if the dimensions have actually changed
            this.canvas.width = width;
            this.canvas.height = height;
            this.lastDimensions = { width, height };
            this.dispatchResizeEvent();
        }
    }

    public destroy(): void {
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = null;
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
    }

    private setupEventListeners(): void {
        // Use the ResizeObserver to listen for changes to the canvas element itself
        this.resizeObserver = new ResizeObserver(() => {
            // Debounce the resize to prevent it from firing too frequently
            if (this.resizeTimer) clearTimeout(this.resizeTimer);
            this.resizeTimer = window.setTimeout(() => {
                this.resize();
                this.resizeTimer = null;
            }, 100);
        });
        this.resizeObserver.observe(this.canvas);
    }

    private dispatchResizeEvent(): void {
        const event = new CustomEvent("canvas-resized", {
            detail: {
                width: this.canvas.width,
                height: this.canvas.height,
                pixelRatio: window.devicePixelRatio || 1,
            },
        });
        this.canvas.dispatchEvent(event);
    }
}
