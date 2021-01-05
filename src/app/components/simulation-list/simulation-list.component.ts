import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { RouteService } from '../../services/route-service/route.service';

@Component({
  selector: 'app-simulation-list',
  templateUrl: './simulation-list.component.html',
  styleUrls: ['./simulation-list.component.scss']
})
export class SimulationListComponent implements OnInit {
  
  @Output() refClicked = new EventEmitter();

  @ViewChild('transform') transformRef: ElementRef;
  @ViewChild('efphSubMenu') efphSubMenuRef: ElementRef;
  @ViewChild('titrationSubMenu') titrationSubMenuRef: ElementRef;

  private open: boolean;
  private showEfphSubMenu: boolean = false;
  private showTitrationSubMenu: boolean = false;

  constructor(
    private renderer: Renderer2,
    private routeService: RouteService
  ) {
      this.open = false;
   }

  ngOnInit(): void {
    this.open = false;
  }

  showNavBar() {
    if (!this.open) {
      this.renderer.setStyle(this.transformRef.nativeElement, 'transform', `translate3d(-10px, 0, 0)`);
      this.open = true;
    } else {
      this.renderer.setStyle(this.transformRef.nativeElement, 'transform', `translate3d(-290px, 0, 0)`);
      this.open = false;
    }
  }

  refClickedEvt(e: any) {
    let words = e.target.href.split('/');
    let urlEnd = words[words.length - 1];
    this.routeService.setPageName(urlEnd);

    this.refClicked.emit();
  }

  toggleEfphSubMenu() {
    if (this.showEfphSubMenu) {
      this.renderer.setStyle(this.efphSubMenuRef.nativeElement, 'display', `none`);
      this.showEfphSubMenu = false;
    } else {
      this.renderer.setStyle(this.efphSubMenuRef.nativeElement, 'display', `block`);
      this.showEfphSubMenu = true;
    }
  }

  toggleTitrationSubMenu() {
    if (this.showTitrationSubMenu) {
      this.renderer.setStyle(this.titrationSubMenuRef.nativeElement, 'display', `none`);
      this.showTitrationSubMenu = false;
    } else {
      this.renderer.setStyle(this.titrationSubMenuRef.nativeElement, 'display', `block`);
      this.showTitrationSubMenu = true;
    }
  }

}
