import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  private efphData: any[];
  newEfphData:EventEmitter<any[]> = new EventEmitter();

  private titrationData: any[];
  newTitrationData:EventEmitter<any[]> = new EventEmitter();

  constructor() { 
    this.efphData = new Array();
  }

  setEfphData(data: any[]): void {
    this.efphData = data;
    this.newEfphData.emit(this.efphData);
  }

  getEfphData() {
    return this.titrationData;
  }

  clearEfphData(): void {
    this.titrationData = new Array();
  } 

  setTitrationData(data: any[]): void {
    this.titrationData = data;
    this.newTitrationData.emit(this.titrationData);
  }

  getTitrationData() {
    return this.titrationData;
  }

  clearTitrationData(): void {
    this.titrationData = new Array();
  } 
}
