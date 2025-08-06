import type { TimeData } from "../interfaces/time-data.js";

export class TimeCalculator {
    private lastTime: number = 0;
    private totalTime: number = 0;

    public calculate(time: number): TimeData {
        if (this.lastTime === 0) {
            this.lastTime = time;
        }

        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;
        this.totalTime += deltaTime;

        return {
            deltaTime,
            totalTime: this.totalTime,
            lastTime: this.lastTime,
        };
    }

    public reset(): void {
        this.lastTime = 0;
        this.totalTime = 0;
    }
}
