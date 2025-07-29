import "./style.css";
import "./fullscreen-canvas.css";
import { FullscreenCanvas } from "./fullscreen-canvas";

// Example usage
const canvas = new FullscreenCanvas("canvas-container", "main-canvas", {
    draw: (ctx, width, height, _deltaTime, totalTime) => {
        // Draw a rotating rectangle
        ctx.fillStyle = `hsl(${(totalTime * 50) % 360}, 100%, 50%)`;
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(totalTime);
        ctx.fillRect(-100, -100, 200, 200);
        ctx.restore();
    },
    loop: true,
});

// For development: expose canvas to console
(window as any).canvas = canvas;
