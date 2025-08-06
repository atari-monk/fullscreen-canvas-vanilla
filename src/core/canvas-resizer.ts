export class CanvasResizer {
    private resizeObserver: ResizeObserver | null = null;
    private handleResizeBound: () => void;
    private resizeTimer: number | null = null;
    private lastDimensions = { width: 0, height: 0 };

    constructor(private canvas: HTMLCanvasElement) {
        this.handleResizeBound = this.handleResize.bind(this);
        this.setupEventListeners();
        this.resize();
    }

    public resize() {
        const { width, height } = this.getDimensions();

        if (
            width !== this.lastDimensions.width ||
            height !== this.lastDimensions.height
        ) {
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
        } else {
            window.removeEventListener("resize", this.handleResizeBound);
        }
    }

    private getDimensions() {
        const container = this.canvas.parentElement || document.body;
        const pixelRatio = window.devicePixelRatio || 1;

        return {
            width: Math.floor(container.clientWidth * pixelRatio),
            height: Math.floor(container.clientHeight * pixelRatio),
        };
    }

    private setupEventListeners(): void {
        if (typeof ResizeObserver !== "undefined") {
            this.resizeObserver = new ResizeObserver(this.handleResizeBound);
            this.resizeObserver.observe(
                this.canvas.parentElement || document.body
            );
        } else {
            window.addEventListener("resize", this.handleResizeBound);
        }
    }

    private handleResize(): void {
        if (this.resizeTimer) clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(() => {
            this.resize();
            this.resizeTimer = null;
        }, 100);
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
