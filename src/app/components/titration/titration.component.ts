import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PhHClNaOH } from '../../classes/phCalculator';
import { PhKOHH2SO4 } from '../../classes/phCalculator';
import { Liquid } from '../../classes/phCalculator';
import { InteractionService } from '../../services/interaction.service';
import { RouteService } from '../../services/route-service/route.service';

@Component({
  selector: 'app-titration',
  templateUrl: './titration.component.html',
  styleUrls: ['./titration.component.scss']
})
export class TitrationComponent implements OnInit, AfterViewInit {

  @ViewChild('whiteContainer') whiteContainerRef: ElementRef;
  @ViewChild('waterDropContainer') waterDropContainerRef: ElementRef;
  @ViewChild('beaker') beakerRef: ElementRef;

  private waterInterval: any;
  private waterDropInterval: any;
  private phCalculator: any;
  private acid: Liquid;
  private alkali: Liquid;
  private data: any[];
  private simMode: string;

  constructor(
      private shareService: InteractionService, 
      private routeService: RouteService
    ) {
    this.initAcidAlkaliTitration();

    this.data = [
      {
        'name': 'pH',
        'series': []
      }
    ];

    this.routeService.newPageName.subscribe((pageName: string) => {
      this.setSimulationMode(pageName);
    });

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
    if (pageName == 'titrationAcid') {
      this.initAcidAlkaliTitration();
      this.restartPage();
      this.simMode = 'titrationAcid';
    } else if (pageName == 'titrationAlkali') {
      this.initAlkaliAcidTitration();
      this.restartPage();
      this.simMode = 'titrationAlkali';
    }
  }

  private initAcidAlkaliTitration() {
    this.phCalculator = new PhHClNaOH();
    this.acid = new Liquid(0.02, 0.095);
    this.alkali = new Liquid(0.001, 0.1);
  }

  private initAlkaliAcidTitration() {
    this.phCalculator = new PhKOHH2SO4();
    this.alkali = new Liquid(0.08, 0.04);
    this.acid = new Liquid(0.001, 0.1);
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
    if (this.simMode == 'titrationAcid') {
      let pH = this.addLiquid(false);
      if (pH > 7) {
        this.beakerRef.nativeElement.src = '../../../assets/icons/beaker_with_phMetr_yellow.svg';
      }
    } else {
      let pH = this.addLiquid(true);
      if (pH < 7) {
        this.beakerRef.nativeElement.src = '../../../assets/icons/beaker_with_phMetr_yellow.svg';
      }
    }
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

  private addLiquid(acid: boolean): number {
    let pHV: any;
    if (acid) {
      pHV = this.addAcid();
    } else {
      pHV = this.addAlkali();
    }

    let val = {
      'name': pHV.V,
      'value': pHV.pH
    }

    this.data[0].series.push(val);
    this.shareService.setTitrationData(this.data);

    return pHV.pH;
  }

  private addAcid(): any {
    let V_acid = this.acid.getV();
    let V = V_acid + 0.001;
    this.acid.setV(V_acid + 0.001);
    let pH = this.phCalculator.calcPh(this.acid, this.alkali);

    return {
      pH: pH,
      V: V
    }
  }

  private addAlkali(): any {
    let V_alkali = this.alkali.getV();
    let V = V_alkali + 0.001;
    this.alkali.setV(V);
    let pH = this.phCalculator.calcPh(this.acid, this.alkali);

    return {
      pH: pH,
      V: V
    }
  }
  
  public restartPage(): void {
    this.restartTitration();
    this.data[0].series = [];
    this.shareService.setTitrationData([]);

    if (this.simMode == 'titrationAcid') {
      this.initAcidAlkaliTitration();
    } else if (this.simMode == 'titrationAlkali') {
      this.initAlkaliAcidTitration();
    }
  }

}
