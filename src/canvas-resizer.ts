export class CanvasResizer {
    constructor(private canvas: HTMLCanvasElement) {}

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}
