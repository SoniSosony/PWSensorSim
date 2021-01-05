export enum Temperature {
    ZERO = 273.15,
    TWENTYFIVE = 298.15,
    ONEHUNDRED = 373.15
}

export class phMeter {
    private readonly F: number = 96485.309;
    private readonly R: number = 8.314510;
    private readonly pHs: number = 7;
    private readonly Es = new Map();
    private T: number = 298.15;

    constructor() {
        this.Es.set(Temperature.ZERO, 0.0542);
        this.Es.set(Temperature.TWENTYFIVE, 0.0591);
        this.Es.set(Temperature.ONEHUNDRED, 0.07404);
    }

    public setTemperature(t: Temperature): void {
        this.T = t;
    }

    public getTemperature(): Temperature {
        return this.T;
    }

    public getVoltage(pHx: number): number {
        return ( this.R * this.T * Math.LN10 * (this.pHs - pHx) + this.Es.get(this.T) * this.F ) / this.F;
    }

}