export interface Tile {
    color: string;
    cols: number;
    rows: number;
    text: string;
  }
  
  export interface PHMeasurement {
    pH: number;
    voltage: number;
  }

  export interface pHV {
      pH: number;
      V: number;
  }

  export interface VoltageMeasurement {
    V: number;
    voltage: number;
  }