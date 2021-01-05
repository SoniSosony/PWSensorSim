import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private pageName: string;
  newPageName:EventEmitter<string> = new EventEmitter();

  constructor() { }

  setPageName(name: string) {
    this.pageName = name;
    localStorage.setItem('pageName', this.pageName);
    this.newPageName.emit(this.pageName);
  }

  getPageName() {
    return this.pageName;
  }
}
