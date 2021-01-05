import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('transform') simulationList: ElementRef;

  private open: boolean;

  constructor(
    private renderer: Renderer2
  ) {
      this.open = false;
   }

  ngOnInit(): void {
    this.open = false;
  }

  showNavBar() {
    if (!this.open) {
      this.renderer.setStyle(this.simulationList.nativeElement, 'transform', `translate3d(-10px, 0, 0)`);
      this.open = true;
    } else {
      this.renderer.setStyle(this.simulationList.nativeElement, 'transform', `translate3d(-290px, 0, 0)`);
      this.open = false;
    }
  }

}
