import { Temperature } from './phMeter';

export class ChartData {

    private dataFrames = new Map;

    constructor() {
        this.initDataFrames();
    }

    public addData(data: any, temperature: Temperature) {
        let frame = this.dataFrames.get(temperature);
        frame.series.push(data);
    }

    public getData(temperature: Temperature): any {
        let data = [];
        let frame = this.dataFrames.get(temperature);
        data.push(frame);
        return data;
    }

    public getСombinedData(): any {
        let data: any[] = [];
        for (let [key, frame] of this.dataFrames) {
            if (frame.series.length != 0) {
                data.push(frame);
            }
        }
        return data;
    }

    public clearData(): void {
        this.initDataFrames();
    }

    private initDataFrames(): void {
        this.dataFrames.set(
            Temperature.ZERO,
            {
                'name': 'pH (T:0)',
                'series': []
            }
        );
        
        this.dataFrames.set(
            Temperature.TWENTYFIVE,
            {
                'name': 'pH (T:25)',
                'series': []
            }
        );

        this.dataFrames.set(
            Temperature.ONEHUNDRED,
            {
                'name': 'pH (T:100)',
                'series': []
            }
        );
    }
    
}