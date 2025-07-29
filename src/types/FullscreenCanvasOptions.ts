export interface FullscreenCanvasOptions {
    draw: (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        deltaTime: number,
        totalTime: number
    ) => void;
    loop?: boolean;
}
