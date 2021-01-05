import { Component, ElementRef, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { DraggableElement } from '../../classes/draggableElement';
import { LiquidСontainer } from '../../classes/LiquidContainer';
import { phMeter } from '../../classes/phMeter';
import { Temperature } from '../../classes/phMeter';
import { ChartData } from '../../classes/ChartData';
import { InteractionService } from '../../services/interaction.service';
import { RouteService } from '../../services/route-service/route.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-efph-buffer',
  templateUrl: './efph-main.component.html',
  styleUrls: ['./efph-main.component.scss']
})
export class EfphMainComponent implements OnInit, AfterViewInit {

  tiles: Tile[] = [
    {text: 'One', cols: 1, rows: 3, color: 'lightblue'},
    {text: 'Two', cols: 3, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 3, rows: 1, color: 'lightpink'},
  ];

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEscEvent(event: KeyboardEvent) { 
    this.pippetteDraggableElement.removeMouseMoveListeners();
    this.pippetteDraggableElement.placeInDefaultPosition();

    this.phMetrDraggableElement.removeMouseMoveListeners();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setupSimToolDivAfterRender();
  }

  @ViewChild('mainSimWindow') mainSimWindowRef: ElementRef;
  @ViewChild('mainDragWindow') mainDragWindowRef: ElementRef;
  @ViewChild('simToolDiv') simToolDivRef: ElementRef;
  @ViewChild('interfaceContainer') interfaceContainerRef: ElementRef;
  @ViewChild('beakersContainer') beakersContainerRef: ElementRef;
  @ViewChild('beakerForTestContainer') beakerForTestContainerRef: ElementRef;
  @ViewChild('temperatureChooserContainer') temperatureChooserContainerRef: ElementRef;

  @ViewChild('pipperreDiv') pippetteDivRef: ElementRef;
  @ViewChild('phMetrDiv') phMetrDivRef: ElementRef;
  @ViewChild('beakerForTest') beakerForTestRef: ElementRef;

  private pippetteDraggableElement: DraggableElement;
  private phMetrDraggableElement: DraggableElement;
  private pippetteLiquidContainer: LiquidСontainer;
  private beakerForTestLiquidСontainer: LiquidСontainer;
  private beakerLiquidContainers = new Map;
  private activeElement: ElementRef;
  private phMetr = new phMeter();
  private beakersContent: any;
  private chartData = new ChartData();

  phValue: string = '';


  constructor(
      private shareService: InteractionService, 
      private routeService: RouteService
    ) {
    this.phMetr.setTemperature(Temperature.TWENTYFIVE);

    this.routeService.newPageName.subscribe((pageName: string) => {
      this.restartPage();
      this.setSimulationMode(pageName);
      this.createBeakerLiquidContainers();
      this.setBeakersText();
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.makePippetteDraggable();
    this.makePhMetrDraggable();
    this.setupSimToolDivAfterRender();
    this.createBeakerForTestLiquidContainer();
    this.createPippetteLiquidContainer();

    let pageName: string= this.routeService.getPageName();
    if(pageName == undefined) {
      pageName = String(localStorage.getItem('pageName'));
    }

    this.setSimulationMode(pageName);
    this.createBeakerLiquidContainers();
  }

  private setSimulationMode(pageName: string) {
    this.beakersContent = new Map();
    
    if(pageName == 'efphBuffer') {
      this.setEfphBufferMode();
    } else if(pageName == 'efphUsual') {
      this.setEfphUsual();
    } else if(pageName == 'eft') {
      this.setEftMode();
    }
  }

  private setEfphBufferMode() {
    this.setBufferBeakersContent();
  }

  private setEfphUsual() {
    this.setUsualBeakerContent();
  }

  private setEftMode() {
    this.setBufferBeakersContent();
    this.temperatureChooserContainerRef.nativeElement.style.display = 'block';
  }

  private setBufferBeakersContent() {
    this.beakersContent.set('beaker_1', { 'name': '2.21pH', 'pH': 2.21} );
    this.beakersContent.set('beaker_2', { 'name': '3.29pH', 'pH': 3.29} );
    this.beakersContent.set('beaker_3', { 'name': '4.56pH', 'pH': 4.56} );
    this.beakersContent.set('beaker_4', { 'name': '5.72pH', 'pH': 5.72} );
    this.beakersContent.set('beaker_5', { 'name': '7.96pH', 'pH': 7.96} );
    this.beakersContent.set('beaker_6', { 'name': '9.15pH', 'pH': 9.15} );
    this.beakersContent.set('beaker_7', { 'name': '10.38pH', 'pH': 10.38} );
  }

  private setUsualBeakerContent() {
    this.beakersContent.set('beaker_1', { 'name': 'krew', 'pH': 7.4} );
    this.beakersContent.set('beaker_2', { 'name': 'mleko', 'pH': 6.6} );
    this.beakersContent.set('beaker_3', { 'name': 'woda', 'pH': 8} );
    this.beakersContent.set('beaker_4', { 'name': 'ocet', 'pH': 2.9} );
    this.beakersContent.set('beaker_5', { 'name': 'cola', 'pH': 2.5} );
    this.beakersContent.set('beaker_6', { 'name': 'sok', 'pH': 2.4} );
    this.beakersContent.set('beaker_7', { 'name': 'herbata', 'pH': 5.5} );
  }

  private setBeakersText() {
    let beakersContainerElements = this.beakersContainerRef.nativeElement.children;
    for (let i = 0 ; i < beakersContainerElements.length; i++) {

      let beakerWithTestContainerElements = beakersContainerElements[i].children;

      for (let j = 0 ; j < beakerWithTestContainerElements.length; j++) {

        if (beakerWithTestContainerElements[j].nodeName == 'IMG') {
          let beakerElement = beakerWithTestContainerElements[j];
          let content = this.beakersContent.get(beakerElement.id);
          
          let textDiv = beakerWithTestContainerElements[j + 1];
          if (textDiv.firstChild.nodeName == '#text') {
            textDiv.innerHTML = content.name;
            textDiv.innerText = content.name;
          }
      
        }

      }

    }
  }

  private createBeakerForTestLiquidContainer() {
    this.beakerForTestLiquidСontainer = new LiquidСontainer();
  }

  private createPippetteLiquidContainer() {
    this.pippetteLiquidContainer = new LiquidСontainer();
  }

  private createBeakerLiquidContainers(): void {
    let beakersContainerElements = this.beakersContainerRef.nativeElement.children;
    for (let i = 0 ; i < beakersContainerElements.length; i++) {
      let beakerWithTestContainerElements = beakersContainerElements[i].children;

      for (let j = 0 ; j < beakerWithTestContainerElements.length; j++) {

        if (beakerWithTestContainerElements[j].nodeName == 'IMG') {
          let beakerElement = beakerWithTestContainerElements[j];
          let beakerLiquidContainer = new LiquidСontainer();
          
          let content = this.beakersContent.get(beakerElement.id);
          beakerLiquidContainer.fill(content.pH, content.name);
    
          this.beakerLiquidContainers.set(beakerElement.id, beakerLiquidContainer);
        }

      }

    }

  }

  mouseDown(event: any): void {
    let elementId = event.target.id;

    if (elementId == 'pippette_div') {
      this.pippetteDraggableElement.onClick(event);
      this.activeElement = this.pippetteDivRef;
    } else if (elementId == 'phMetr_div' && !this.isPhMetrInBeakerForTest()) {
      this.phMetrDraggableElement.onClick(event);
      this.activeElement = this.phMetrDivRef;
    }
  }

  beakerClicked(event: any): void {
    let imgId = event.target.id;
    let beakerLiquidContainer = this.beakerLiquidContainers.get(imgId);

    if (this.activeElement == this.pippetteDivRef) {

      if (this.pippetteLiquidContainer.isEmpty()) {

        if (!beakerLiquidContainer.isEmpty()) {
          let ph = beakerLiquidContainer.getPh();
          let liquidType = beakerLiquidContainer.getLiquidType();
          this.pippetteLiquidContainer.fill(ph, liquidType);
  
          let img = this.activeElement.nativeElement.children[0];
          img.src = '../../../assets/icons/pipette_full.svg'
        }

      }

    }
  }

  beakerForTestContainerClicked(event: any): void {
    if(event.target.nodeName != 'BUTTON') {
      if (this.activeElement == this.pippetteDivRef) {
        this.clickedByPippete(event);
      } else if (this.activeElement == this.phMetrDivRef) {
        this.clickedByPhMetr();
      }
    }
  }


  private clickedByPippete(event: any): void {
    if (!this.pippetteLiquidContainer.isEmpty() && this.beakerForTestLiquidСontainer.isEmpty()) {
      let pH = this.pippetteLiquidContainer.getPh();
      let liquidType = this.pippetteLiquidContainer.getLiquidType();
      this.beakerForTestLiquidСontainer.fill(pH, liquidType);

      let img = this.beakerForTestRef.nativeElement;
      img.src = '../../../assets/icons/beaker_full.svg';

      this.toEmptyPippette();

      if (this.isPhMetrInBeakerForTest()) {
        let voltage = this.phMetr.getVoltage(pH) * 1000;
        this.phValue = voltage.toFixed(2)  + 'mV';
        this.addChartData(pH, voltage);
      }
    }
  }

  private toEmptyPippette() {
    this.pippetteLiquidContainer.toEmpty();
    let img = this.pippetteDivRef.nativeElement.children[0];
    img.src = '../../../assets/icons/pipette_empty.svg'
  }

  private clickedByPhMetr(): void {
      let phMetrBeakerForTest = this.beakerForTestContainerRef.nativeElement.children[0];
      phMetrBeakerForTest.style.opacity = 100;

      if (!this.beakerForTestLiquidСontainer.isEmpty()) {
        let pH = this.beakerForTestLiquidСontainer.getPh();
        let voltage = this.phMetr.getVoltage(pH) * 1000;
        this.phValue = voltage.toFixed(2) + 'mV';
        this.addChartData(pH, voltage);
      }

      let phMetr = this.phMetrDivRef.nativeElement.children[0];
      phMetr.style.opacity = 0;
      this.phMetrDraggableElement.removeMouseMoveListeners();
      this.phMetrDraggableElement.placeInDefaultPosition();
  }

  toEmptyBeakerForTest():void {
    if (!this.beakerForTestLiquidСontainer.isEmpty()) {
      this.beakerForTestLiquidСontainer.toEmpty();
      let img = this.beakerForTestRef.nativeElement;
      img.src = '../../../assets/icons/beaker_empty.svg';
      this.phValue = '';
    }
  }

  private makePippetteDraggable(): void {
    let defaultPositionX = this.simToolDivRef.nativeElement.offsetLeft;
    let defaultPositionY = this.simToolDivRef.nativeElement.offsetTop;

    let options = {
      elementRef: this.pippetteDivRef,
      dragOn: this.mainSimWindowRef,
      defaultPositionX: defaultPositionX,
      defaultPositionY: defaultPositionY,
    }

    this.pippetteDraggableElement = new DraggableElement(options); 
    this.pippetteDraggableElement.placeInDefaultPosition();
  }

  private makePhMetrDraggable(): void {
    let defaultPosition = this.calcPhMetrDefaulPosition();

    let options = {
      elementRef: this.phMetrDivRef,
      dragOn: this.mainSimWindowRef,
      defaultPositionX: defaultPosition.defaultPositionX,
      defaultPositionY: defaultPosition.defaultPositionY,
    }

    this.phMetrDraggableElement = new DraggableElement(options); 
    this.phMetrDraggableElement.placeInDefaultPosition();
  }


  private async setupSimToolDivAfterRender() {
    let offsetWidth = this.phMetrDivRef.nativeElement.offsetWidth;
    
    if (offsetWidth > 0) {
      this.simToolDivRef.nativeElement.style.width = offsetWidth + 'px';

      let defaultPositionX = this.simToolDivRef.nativeElement.offsetLeft + offsetWidth / 3;
      let defaultPositionY = this.simToolDivRef.nativeElement.offsetTop;

      this.pippetteDraggableElement.setDefaultPosition(defaultPositionX, defaultPositionY);
      this.pippetteDraggableElement.placeInDefaultPosition();

      let phMetrDefaultPosition = this.calcPhMetrDefaulPosition();
      this.phMetrDraggableElement.setDefaultPosition(phMetrDefaultPosition.defaultPositionX, phMetrDefaultPosition.defaultPositionY);
      this.phMetrDraggableElement.placeInDefaultPosition();

      let x = this.simToolDivRef.nativeElement.offsetLeft + offsetWidth;
      let y = this.simToolDivRef.nativeElement.offsetTop;
      this.setInterfaceContainerPosition(x, y);
      this.interfaceContainerRef.nativeElement.style.marginLeft = '1%';

    } else {
      let outerThis = this;
      setTimeout(function() { outerThis.setupSimToolDivAfterRender(); }, 100);
    }
  }

  private setInterfaceContainerPosition(x: number, y: number) {
    this.interfaceContainerRef.nativeElement.style.left = x + 'px';
    this.interfaceContainerRef.nativeElement.style.top = y + 'px';
  }

  private calcPhMetrDefaulPosition() {
    let defaultPositionX = this.simToolDivRef.nativeElement.offsetLeft;

    let simToolDivHeight = this.simToolDivRef.nativeElement.offsetHeight;
    let phMetrDivHeight = this.phMetrDivRef.nativeElement.offsetHeight;
    let offsetHeight = simToolDivHeight - phMetrDivHeight;
    let defaultPositionY = this.mainDragWindowRef.nativeElement.offsetTop + offsetHeight;

    return {
      defaultPositionX: defaultPositionX,
      defaultPositionY: defaultPositionY
    }
  }

  private isPhMetrInBeakerForTest() {
    let phMetr = this.phMetrDivRef.nativeElement.children[0];
    let phMetrOpacity = phMetr.style.opacity;
    if (phMetrOpacity == 0) {
      return true;
    }
    return false;
  }
  
  private addChartData(pH: number, voltage: number) {

    let val = {
      "name": pH,
      "value": voltage
    }

    let temperature = this.phMetr.getTemperature();
    this.chartData.addData(val, temperature);
    this.shareService.setEfphData(this.chartData.getСombinedData());
  }

  private restartPage(): void {
    this.toEmptyBeakerForTest();
    this.toEmptyPippette();
    this.placePhMetrInDefaultPosition();
    this.chartData.clearData();
    this.shareService.setEfphData([]);
    this.phValue = '';
    this.temperatureChooserContainerRef.nativeElement.style.display = 'none';
  }

  private placePhMetrInDefaultPosition(): void {
    this.phMetrDraggableElement.placeInDefaultPosition();
    let phMetrBeakerForTest = this.beakerForTestContainerRef.nativeElement.children[0];
    phMetrBeakerForTest.style.opacity = 0;
    let phMetr = this.phMetrDivRef.nativeElement.children[0];
    phMetr.style.opacity = 100;
  }

  temperatureChooseEvt(e: any): void {
    let temperature: string = e.target.value;
    this.setPhMetrTemperatureByStringValue(temperature);
  }

  private setPhMetrTemperatureByStringValue(temperature: string): void {
    if (temperature == '0') {
      this.phMetr.setTemperature(Temperature.ZERO);
    } else if (temperature == '25') {
      this.phMetr.setTemperature(Temperature.TWENTYFIVE);
    } else if (temperature == '100' ) {
      this.phMetr.setTemperature(Temperature.ONEHUNDRED);
    }
  }

}
