import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PhHClNaOH } from '../../classes/phCalculator';
import { PhKOHH2SO4 } from '../../classes/phCalculator';
import { Liquid } from '../../classes/phCalculator';
import { InteractionService } from '../../services/interaction.service';
import { RouteService } from '../../services/route-service/route.service';
import { pHV } from '../../classes/interfaces/basic';
import { phMeter, Temperature } from '../../classes/phMeter';
import { VoltageMeasurement } from '../../classes/interfaces/basic';
import { LineChartComponent } from '../line-chart/line-chart.component';

@Component({
  selector: 'app-titration',
  templateUrl: './titration.component.html',
  styleUrls: ['./titration.component.scss']
})
export class TitrationComponent implements OnInit, AfterViewInit {

  @ViewChild('title') titleRef: ElementRef;

  @ViewChild('whiteContainer') whiteContainerRef: ElementRef;
  @ViewChild('waterDropContainer') waterDropContainerRef: ElementRef;
  @ViewChild('beaker') beakerRef: ElementRef;
  @ViewChild('table') tableRef: ElementRef;

  @ViewChild('userValue') userValueRef: ElementRef;
  @ViewChild('checkStatusSpan') checkStatusSpanRef: ElementRef;

  private waterInterval: any;
  private waterDropInterval: any;
  private phCalculator: any;
  private acid: Liquid;
  private alkali: Liquid;
  private data: any[];
  private simMode: string;
  private phMeter = new phMeter();
  private answer: number;
  showEquations: boolean = false;
  showInstruction: boolean = false;
  currentItem = 'Television';

  displayedColumns: string[] = ["V", "voltage"];
  dataSource: VoltageMeasurement[] = [];

  constructor(
      private shareService: InteractionService,
      private routeService: RouteService
    ) {
    this.initAcidAlkaliTitration();

    this.data = [
      {
        'name': 'Voltage',
        'series': []
      }
    ];

    this.routeService.newPageName.subscribe((pageName: string) => {
      this.setSimulationMode(pageName);
    });

    this.phMeter.setTemperature(Temperature.TWENTYFIVE);

   }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let pageName: string = this.routeService.getPageName();
    if(pageName == undefined) {
      pageName = String(localStorage.getItem('pageName'));
    }
    this.setSimulationMode(pageName);
  }

  private setSimulationMode(pageName: string): void {
    this.setTitle(pageName);

    if (pageName == 'titrationAcid') {
      this.initAcidAlkaliTitration();
      this.restartPage();
      this.showInstruction = true;
      this.simMode = 'titrationAcid';
    } else if (pageName == 'titrationAlkali') {
      this.initAlkaliAcidTitration();
      this.restartPage();
      this.showInstruction = false;
      this.simMode = 'titrationAlkali';
    }
  }

  private setTitle(pageName: string): void {
    if (pageName == 'titrationAcid') {
      this.titleRef.nativeElement.innerHTML = "Acid - base titration";
    } else if (pageName == 'titrationAlkali') {
      this.titleRef.nativeElement.innerHTML = "Base - acid titration";
    }
  }

  private initAcidAlkaliTitration() {
    this.phCalculator = new PhHClNaOH();
    this.answer = this.getRandomConcentration(0.095);
    this.acid = new Liquid(0.02, this.answer);
    this.alkali = new Liquid(0.001, 0.1);
  }

  private initAlkaliAcidTitration() {
    this.phCalculator = new PhKOHH2SO4();
    this.answer = this.getRandomConcentration(0.04);
    this.alkali = new Liquid(0.08, this.answer);
    this.acid = new Liquid(0.001, 0.1);
  }

  private getRandomConcentration(concentration: number) {
    return Math.floor(Math.random() * 10) / 1000 + concentration;
  }

  public startTitration(): void {
    this.setBiuretaInterval();
  }

  private setBiuretaInterval(): void {
    let outerThis = this;
    this.waterInterval = setInterval(function() {
      let height = outerThis.whiteContainerRef.nativeElement.style.height;
      let number = outerThis.convertPercentToNumber(height);
      if (number > 56) {
        clearInterval(outerThis.waterInterval);
        clearInterval(outerThis.waterDropInterval);
      } else {
        outerThis.animateTitrationProcess();
        outerThis.setWaterDropInterval();
        outerThis.calcTitration();
      }

    }, 700);
  }

  private setWaterDropInterval(): void {
    let outerThis = this;
    this.waterDropInterval = setInterval(function() {
      let marginTop = outerThis.waterDropContainerRef.nativeElement.style.marginTop;
      let number = outerThis.convertPercentToNumber(marginTop);
      if (number > 80) {
        clearInterval(outerThis.waterDropInterval);
        outerThis.waterDropContainerRef.nativeElement.style.opacity = 0;
        outerThis.waterDropContainerRef.nativeElement.style.marginTop = '0%';
      } else {
        outerThis.animateWaterDrop();
      }

    }, 10);
  }

  private calcTitration(): void {
    let pHV: pHV;
    if (this.simMode == 'titrationAcid') {
      pHV = this.addLiquid(false);
      if (pHV.pH > 7) {
        this.beakerRef.nativeElement.src = '../../../assets/icons/beaker_with_phMetr_yellow.svg';
      }
    } else {
      pHV = this.addLiquid(true);
      if (pHV.pH < 7) {
        this.beakerRef.nativeElement.src = '../../../assets/icons/beaker_with_phMetr_yellow.svg';
      }
    }
    this.addDataToChart(pHV);
    this.addDataToTabel(pHV);
  }

  private animateTitrationProcess(): void {
    let whiteContainerElement = this.whiteContainerRef.nativeElement;
    let height = whiteContainerElement.style.height;
    if (height == '') {
      whiteContainerElement.style.height = '24%';
    } else {
      whiteContainerElement.style.height = this.increaseCSSPercentValue(height, 1);
    }
  }

  private increaseCSSPercentValue(str: string, step: number): string {
    let  number = this.convertPercentToNumber(str);
    number += step;
    return number + '%'; 
  }

  private animateWaterDrop(): void {
    let waterDropContainerElement = this.waterDropContainerRef.nativeElement;
    waterDropContainerElement.style.opacity = 100;
    let marginTop = waterDropContainerElement.style.marginTop;
    if (marginTop == '') {
      waterDropContainerElement.style.marginTop = '0%';
    } else {
      waterDropContainerElement.style.marginTop = this.increaseCSSPercentValue(marginTop, 2);
    }
  }

  private restartTitration(): void {
    clearInterval(this.waterInterval);
    clearInterval(this.waterDropInterval);

    this.whiteContainerRef.nativeElement.style.height = '24%';
    this.waterDropContainerRef.nativeElement.style.opacity = 0;
    this.waterDropContainerRef.nativeElement.style.marginTop = '0%';
    this.beakerRef.nativeElement.src = '../../../assets/icons/beaker_with_phMetr_red.svg';

  }

  private convertPercentToNumber(str: string): number {
    let newStr = str.slice(0, -1);
    let number = parseInt(newStr);
    return number;
  }

  private addLiquid(acid: boolean): pHV {
    let pHV: any;
    if (acid) {
      pHV = this.addAcid();
    } else {
      pHV = this.addAlkali();
    }

    return pHV;
  }

  private addAcid(): pHV {
    let V_acid = this.acid.getV();
    let V = V_acid + 0.001;
    this.acid.setV(V_acid + 0.001);
    let pH = this.phCalculator.calcPh(this.acid, this.alkali);

    let pHV: pHV = {
     pH: pH,
     V: V 
    };

    return pHV;
  }

  private addAlkali(): pHV {
    let V_alkali = this.alkali.getV();
    let V = V_alkali + 0.001;
    this.alkali.setV(V);
    let pH = this.phCalculator.calcPh(this.acid, this.alkali);

    let pHV: pHV = {
      pH: pH,
      V: V 
     };

     return pHV;
  }
  
  public restartPage(): void {
    this.restartTitration();
    this.data[0].series = [];
    this.shareService.setTitrationData([]);
    this.clearTable();
  }

  private addDataToChart(pHV: pHV): void {
    let voltage = this.phMeter.getVoltage(pHV.pH);
    let newData = {
      'name': pHV.V,
      'value': voltage
    }

    this.data[0].series.push(newData);
    this.shareService.setTitrationData(this.data);
  }

  private addDataToTabel(pHV: pHV): void {
    let newData: VoltageMeasurement[] = [];
    
    for (let i = 0; i < this.dataSource.length; i++) {
      let val: VoltageMeasurement = {V: 0, voltage: 0};
      val.V = this.dataSource[i].V;
      val.voltage = this.dataSource[i].voltage;
      newData.push(val);
    }

    let voltage = this.phMeter.getVoltage(pHV.pH);
    voltage = parseFloat(voltage.toFixed(3));
    let V = parseFloat(pHV.V.toFixed(3));

    let val = {
      V: V,
      voltage: voltage
    }

    newData.push(val);

    this.dataSource = newData;
  }

  private clearTable() {
    this.dataSource = [];
  }

  public checkUserInput(e: any) {
    if (this.dataSource.length > 0) {
      if (this.userValueRef.nativeElement.value < (this.answer + 0.05) && this.userValueRef.nativeElement.value > (this.answer - 0.05)) {
        this.visualisateCheckStatus(true);
      } else {
        this.visualisateCheckStatus(false);
      }
    }
  }

  private visualisateCheckStatus(bCorrect: boolean): void {
    if (bCorrect) {
      this.userValueRef.nativeElement.style.borderColor = 'rgb(100, 100, 100)';
      this.checkStatusSpanRef.nativeElement.innerHTML = 'Correct';
    } else {
      this.userValueRef.nativeElement.style.borderColor = 'rgb(209, 0, 0)';
      this.checkStatusSpanRef.nativeElement.innerHTML = 'Wrong';
    }
  }

}
