import { ControlContainer } from "@angular/forms"

export class Liquid {

    private V: number;
    private c: number;

    constructor(V: number, c: number) {
        this.V = V;
        this.c = c;
    }

    public setV(V: number): void {
        this.V = V;
    }

    public getV(): number {
        return this.V;
    }

    public setc(c: number): void {
        this.c = c;
    }

    public getc(): number {
        return this.c; 
    }

}

export class PhHClNaOH {

    private HCl: Liquid;
    private NaOH: Liquid;

    constructor() {
    }

    public calcPh(HCl: Liquid, NaOH: Liquid): number {
        this.HCl = HCl;
        this.NaOH = NaOH;

        return this.calc();
    }

    private calc(): number {
        let V_HCl = this.HCl.getV();
        let c_HCl = this.HCl.getc();
        let V_NaOH = this.NaOH.getV();
        let c_NaOH = this.NaOH.getc();

        let n_HCl = V_HCl * c_HCl;
        let n_NaOH = V_NaOH * c_NaOH;

        let n_abs = Math.abs(n_HCl - n_NaOH);

        let V = V_HCl + V_NaOH;
        
        let H = n_abs / V;

        if (H < 0.0000001) {
            H = 0.0000001;
        }

        let ph = -Math.log10(H);

        if (n_NaOH < n_HCl) {
            return ph;           
        } else {
            return 14 - ph;
        }

    }

}

export class PhKOHH2SO4 {
    private KOH: Liquid;
    private H2SO4: Liquid;

    constructor() {
    }

    public calcPh(H2SO4: Liquid, KOH: Liquid): number {
        this.KOH = KOH;
        this.H2SO4 = H2SO4;

        return this.calc();
    }

    private calc(): number {
        let V_KOH = this.KOH.getV();
        let c_KOH = this.KOH.getc();
        let V_H2SO4 = this.H2SO4.getV();
        let c_H2SO4 = this.H2SO4.getc();

        let n_KOH = V_KOH * c_KOH;
        let n_H2SO4 = V_H2SO4 * c_H2SO4;

        let n_abs = Math.abs((n_KOH / 2) - n_H2SO4);

        let V = V_KOH + V_H2SO4;
        
        let H = n_abs / V;

        if (H < 0.0000001) {
            H = 0.0000001;
        }

        let ph = -Math.log10(H);

        if ((n_KOH / 2) < n_H2SO4) {
            return ph;           
        } else {
            return 14 - ph;
        }

    }
}