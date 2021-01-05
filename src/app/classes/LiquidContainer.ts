import { ElementRef } from '@angular/core';

export class LiquidСontainer {

    private ph: number;
    private type: string;
    private empty: boolean;

    constructor() {
        this.empty = true;
    }

    fill(ph: number, type: string) {
        this.ph = ph;
        this.type = type;
        this.empty = false;
    }

    toEmpty() {
        this.empty = true;
    }

    getPh() {
        return this.ph;
    }

    getLiquidType() {
        return this.type;
    }

    isEmpty() {
        return this.empty;
    }

}