import { Component, ElementRef, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { DraggableElement } from '../../classes/draggableElement';
import { LiquidСontainer } from '../../classes/LiquidContainer';
import { phMeter } from '../../classes/phMeter';
import { Temperature } from '../../classes/phMeter';
import { ChartData } from '../../classes/ChartData';
import { InteractionService } from '../../services/interaction.service';
import { RouteService } from '../../services/route-service/route.service';
import { PHMeasurement } from '../../classes/interfaces/basic';

@Component({
  selector: 'app-efph-buffer',
  templateUrl: './efph-main.component.html',
  styleUrls: ['./efph-main.component.scss']
})
export class EfphMainComponent implements OnInit, AfterViewInit {

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

  @ViewChild('title') titleRef: ElementRef;

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
  @ViewChild('userValue') userValueRef: ElementRef;
  @ViewChild('addValueToTableBtn') addValueToTableBtnRef: ElementRef;
  @ViewChild('checkStatusSpan') checkStatusSpanRef: ElementRef;

  @ViewChild('tableZero') tableZeroRef: ElementRef;
  @ViewChild('tableTwentyFive') tableTwentyFiveRef: ElementRef;
  @ViewChild('tableOnehundred') tableOnehundredRef: ElementRef;
  @ViewChild('tablesNames') tablesNamesRef: ElementRef;

  @ViewChild('eftText') eftTextRef: ElementRef;
  @ViewChild('efphInstruction') efphInstructionRef: ElementRef;
  @ViewChild('eftInstruction') eftInstructionRef: ElementRef;

  @ViewChild('chooserZeroTemperature') chooserZeroTemperatureRef: ElementRef;
  @ViewChild('chooserOnehundredTemperature') chooserOnehundredTemperatureRef: ElementRef;
  @ViewChild('tableNameZeroTemperature') tableNameZeroTemperatureRef: ElementRef;
  @ViewChild('tableNameOnehundredTemperature') tableNameOnehundredTemperatureRef: ElementRef;

  @ViewChild('instruction') instructionRef: ElementRef;
  @ViewChild('chart') chartRef: ElementRef;

  private pippetteDraggableElement: DraggableElement;
  private phMetrDraggableElement: DraggableElement;
  private pippetteLiquidContainer: LiquidСontainer;
  private beakerForTestLiquidСontainer: LiquidСontainer;
  private beakerLiquidContainers = new Map;
  private activeElement: ElementRef;
  private phMetr = new phMeter();
  private beakersContent: any;
  private chartData = new ChartData();
  private pageName: string;
  showEquations: boolean = false;
  showBeakersText: boolean = false;

  voltageValue: string = '';
  temperatureEs: string = '59.16 mV';

  displayedColumns: string[] = ["pH", "voltage"];
  dataSourceFirst: PHMeasurement[] = [];
  dataSourceSecond: PHMeasurement[] = [];
  dataSourceThird: PHMeasurement[] = [];

  constructor(
      private shareService: InteractionService, 
      private routeService: RouteService
    ) {
    this.phMetr.setTemperature(Temperature.TWENTYFIVE);

    this.routeService.newPageName.subscribe((pageName: string) => {
      this.restartPage();
      this.pageName = pageName;
      this.setSimulationMode(pageName);
      this.createBeakerLiquidContainers();
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

    this.pageName = this.routeService.getPageName();
    if(this.pageName == undefined) {
      this.pageName = String(localStorage.getItem('pageName'));
    }

    this.setSimulationMode(this.pageName);
    this.createBeakerLiquidContainers();
  }

  private setSimulationMode(pageName: string) {
    this.beakersContent = new Map();

    this.setTitle(pageName);
    this.setBeakersTextVisibility(pageName);
    
    if(pageName == 'efphBuffer') {
      this.setEfphBuffer(pageName);
    } else if(pageName == 'efphUsual') {
      this.setEfphUsual(pageName);
    } else if(pageName == 'eft') {
      this.setEftMode(pageName);
    }

    this.setTeablesView(pageName);
  }

  private setTitle(pageName: string): void {
    if(pageName == 'efphBuffer') {
      this.titleRef.nativeElement.innerHTML = "Determination of the Eout = f (pH) characteristics for test solutions";
    } else if(pageName == 'efphUsual') {
      this.titleRef.nativeElement.innerHTML = "Determination of the Eout = f (pH) characteristics for selected aqueous solutions";
    } else if(pageName == 'eft') {
      this.titleRef.nativeElement.innerHTML = "Determination of the Eout = f (T) characteristic";
    }
  }

  private setBeakersTextVisibility(pageName: string): void {
    if(pageName == 'efphBuffer') {
      this.showBeakersText = false;
    } else if(pageName == 'efphUsual') {
      this.showBeakersText = true;
    } else if(pageName == 'eft') {
      this.showBeakersText = false;
    }
  }

  private setEfphBuffer(pageName: string) {
    this.setBufferBeakersContent();
    this.setTeablesView(pageName);
    this.setInstructionView(pageName);
  }

  private setEfphUsual(pageName: string) {
    this.setUsualBeakerContent();
    this.setTeablesView(pageName);
    this.setInstructionView(pageName);
  }

  private setEftMode(pageName: string) {
    this.setBufferBeakersContent();
    this.setTeablesView(pageName);
    this.setInstructionView(pageName);
    this.temperatureChooserContainerRef.nativeElement.style.display = 'block';
  }

  private setBufferBeakersContent() {
    this.beakersContent.set('beaker_1', { 'name': '1.7pH', 'pH': this.getRandomPH(1.7)} );
    this.beakersContent.set('beaker_2', { 'name': '2.8pH', 'pH': this.getRandomPH(2.8)} );
    this.beakersContent.set('beaker_3', { 'name': '4pH', 'pH': this.getRandomPH(4)} );
    this.beakersContent.set('beaker_4', { 'name': '5.3pH', 'pH': this.getRandomPH(5.3)} );
    this.beakersContent.set('beaker_5', { 'name': '7.5pH', 'pH': this.getRandomPH(7.5)} );
    this.beakersContent.set('beaker_6', { 'name': '9.7pH', 'pH': this.getRandomPH(9.7)} );
    this.beakersContent.set('beaker_7', { 'name': '12.1pH', 'pH': this.getRandomPH(12.1)} );
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

  private getRandomPH(ph: number): number {
    return Math.floor(Math.random() * 100) / 100 + ph;
  }
 
  private setTeablesView(pageName: string): void {
    if(pageName == 'efphBuffer' || pageName == 'efphUsual') {
      this.tableZeroRef.nativeElement.style.display = 'none';
      this.tableOnehundredRef.nativeElement.style.display = 'none';
      this.tablesNamesRef.nativeElement.style.display = 'none';
    } else if(pageName == 'eft') {
      this.tableZeroRef.nativeElement.style.display = 'block';
      this.tableOnehundredRef.nativeElement.style.display = 'block';
      this.tablesNamesRef.nativeElement.style.display = 'block';
    }
  }
  private setInstructionView(pageName: string) {
    if(pageName == 'efphBuffer' || pageName == 'efphUsual') {
      this.eftTextRef.nativeElement.style.display = 'none';
      this.efphInstructionRef.nativeElement.style.display = 'block';
      this.eftInstructionRef.nativeElement.style.display = 'none';
    } else if(pageName == 'eft') {
      this.eftTextRef.nativeElement.style.display = 'block';
      this.efphInstructionRef.nativeElement.style.display = 'none';
      this.eftInstructionRef.nativeElement.style.display = 'block';
    }
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
        this.voltageValue = voltage.toFixed(2)  + 'mV';
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
        this.voltageValue = voltage.toFixed(2) + 'mV';
      }

      let phMetr = this.phMetrDivRef.nativeElement.children[0];
      phMetr.style.opacity = 0;
      this.phMetrDraggableElement.removeMouseMoveListeners();
      this.phMetrDraggableElement.placeInDefaultPosition();
  }

  public toEmptyBeakerForTest():void {
    if (!this.beakerForTestLiquidСontainer.isEmpty()) {
      this.beakerForTestLiquidСontainer.toEmpty();
      let img = this.beakerForTestRef.nativeElement;
      img.src = '../../../assets/icons/beaker_empty.svg';
      this.voltageValue = '';
      this.addValueToTableBtnRef.nativeElement.disabled = true;
      this.checkStatusSpanRef.nativeElement.innerHTML = '';
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
      let defaultPositionY = 136; // this.simToolDivRef.nativeElement.offsetTop;

      this.pippetteDraggableElement.setDefaultPosition(defaultPositionX, defaultPositionY);
      this.pippetteDraggableElement.placeInDefaultPosition();

      let phMetrDefaultPosition = this.calcPhMetrDefaulPosition();
      this.phMetrDraggableElement.setDefaultPosition(phMetrDefaultPosition.defaultPositionX, phMetrDefaultPosition.defaultPositionY);
      this.phMetrDraggableElement.placeInDefaultPosition();

      let x = this.simToolDivRef.nativeElement.offsetLeft + offsetWidth;
      let y = this.simToolDivRef.nativeElement.offsetTop;
      this.setInterfaceContainerPosition(x, 136);

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
    let defaultPositionY = 136 + offsetHeight; // this.mainDragWindowRef.nativeElement.offsetTop + offsetHeight;

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
    this.clearTablesData();
    this.hideChart();
    this.chartData.clearData();
    this.shareService.setEfphData([]);
    this.voltageValue = '';
    this.temperatureChooserContainerRef.nativeElement.style.display = 'none';
    this.addValueToTableBtnRef.nativeElement.disabled = true;
    this.userValueRef.nativeElement.value = "";
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
    this.setTemperatureEs(temperature);
    this.setPhMetrTemperatureByStringValue(temperature);
    this.toEmptyBeakerForTest();
    this.addValueToTableBtnRef.nativeElement.disabled = true;
  }

  private setTemperatureEs(temperature: string) {
    if (temperature == '0') {
      this.temperatureEs = '54.2 mV';
    } else if (temperature == '25') {
      this.temperatureEs = '59.16 mV';
    } else if (temperature == '100' ) {
      this.temperatureEs = '74.04 mV';
    }
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

  public checkUserInput(e: any) {
    if (this.pageName == 'efphBuffer' || this.pageName == 'efphUsual') {
      this.checkUserPH();
    } else if (this.pageName == 'eft') {
      this.checkUserTemperature();
    }

  }

  private checkUserPH() {
    if (this.voltageValue != '') {
      let userPH = this.userValueRef.nativeElement.value;
      let pH = this.beakerForTestLiquidСontainer.getPh();
      if ( userPH < (pH + 0.5) && userPH > (pH - 0.5) ) {
        this.visualisateCheckStatus(true);
      } else {
        this.visualisateCheckStatus(false);
      }
    }
  }

  private checkUserTemperature() {
    if (this.voltageValue != '') {
      let userTemperature = this.userValueRef.nativeElement.value;
      let temperature = this.phMetr.getTemperatureInCelsius();
      if ( userTemperature < (temperature + 10) && userTemperature > (temperature -10) ) {
        this.visualisateCheckStatus(true);
      } else {
        this.visualisateCheckStatus(false);
      }

      temperature = this.phMetr.getTemperature();
      this.setTableTextByTemperature(temperature);
      this.setRadioButtonTextByTemperature(temperature);
    }
  }

  private visualisateCheckStatus(bCorrect: boolean): void {
    if (bCorrect) {
      this.userValueRef.nativeElement.style.borderColor = 'rgb(100, 100, 100)';
      this.addValueToTableBtnRef.nativeElement.disabled = false;
      this.checkStatusSpanRef.nativeElement.innerHTML = 'Correct';
      this.checkStatusSpanRef.nativeElement.style.color = 'Green';
    } else {
      this.userValueRef.nativeElement.style.borderColor = 'rgb(209, 0, 0)';
      this.addValueToTableBtnRef.nativeElement.disabled = true;
      this.checkStatusSpanRef.nativeElement.innerHTML = 'Wrong';
      this.checkStatusSpanRef.nativeElement.style.color = 'Red';
    }
  }

  private setTableTextByTemperature(temperature: Temperature) {
    if (temperature == Temperature.ZERO) {
      this.tableNameZeroTemperatureRef.nativeElement.innerHTML = '0°C';
    } else if (temperature == Temperature.ONEHUNDRED) {
      this.tableNameOnehundredTemperatureRef.nativeElement.innerHTML = '100°C';
    }
  }

  private setRadioButtonTextByTemperature(temperature: Temperature) {
    if (temperature == Temperature.ZERO) {
      this.chooserZeroTemperatureRef.nativeElement.innerHTML = '0°C';
    } else if (temperature == Temperature.ONEHUNDRED) {
      this.chooserOnehundredTemperatureRef.nativeElement.innerHTML = '100°C'
    }
  }

  public addValueToTable() {

    let pH = this.beakerForTestLiquidСontainer.getPh();
    let voltage = parseInt( this.voltageValue.slice(0, -2) );

    let newData: PHMeasurement = {
      pH: pH, 
      voltage: voltage
    };

    let temperature = this.phMetr.getTemperature();
    this.addDataToTableByTemperature(temperature, newData);

    this.addChartData(pH, voltage);

    this.showChart();
  }

  private addDataToTableByTemperature(tableType: Temperature, newData: PHMeasurement): void {
    if (tableType == Temperature.ZERO) {
      this.dataSourceFirst = this.getNewDataToTableData(this.dataSourceFirst, newData);
    } else if (tableType == Temperature.TWENTYFIVE) {
      this.dataSourceSecond = this.getNewDataToTableData(this.dataSourceSecond, newData);
    } else if (tableType == Temperature.ONEHUNDRED) {
      this.dataSourceThird = this.getNewDataToTableData(this.dataSourceThird, newData);
    }
  }

  private showChart() {
    this.chartRef.nativeElement.style.display = 'block';
    this.instructionRef.nativeElement.style.display = 'none';
  }

  private hideChart() {
    this.chartRef.nativeElement.style.display = 'none';
    this.instructionRef.nativeElement.style.display = 'block';
  }

  private clearTablesData(): void {
    this.dataSourceFirst = [];
    this.dataSourceSecond = [];
    this.dataSourceThird = [];
  }

  private getNewDataToTableData(tableData: PHMeasurement[], newData: PHMeasurement): PHMeasurement[] {
    let data: PHMeasurement[] = [];
    for (let i = 0; i < tableData.length; i++) {
      let value: PHMeasurement = tableData[i];
      
      if (value.pH != newData.pH) {
        data.push(value);
      } else {
        alert('Value already exist in table');
        return tableData;
      }
    }

    data.push(newData);

    return data;
  }

  public goToLink(url: string){
    window.open(url, "_blank");
  }

}
