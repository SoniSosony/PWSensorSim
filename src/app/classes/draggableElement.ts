import { ElementRef } from '@angular/core';
import { DraggableElementOptions } from '../interfaces/draggable-element-interfaces';

export class DraggableElement {

    private elementRef: ElementRef;
    private dragOn: ElementRef;

    private defaultPositionX: number;
    private defaultPositionY: number;

    private listeners: any = [];

    constructor(options: DraggableElementOptions) {
        this.elementRef = options.elementRef;
        this.dragOn = options.dragOn;
        this.defaultPositionX = options.defaultPositionX;
        this.defaultPositionY = options.defaultPositionY;
        this.setDefaultPosition(this.defaultPositionX, this.defaultPositionY);
    }

    setDefaultPosition(x: number, y: number) {
        let nativeElement = this.elementRef.nativeElement;
        this.defaultPositionX = x;
        this.defaultPositionY = y;
    }

    placeInDefaultPosition() {
        let nativeElement = this.elementRef.nativeElement;
        nativeElement.style.left = this.defaultPositionX + 'px';
        nativeElement.style.top = this.defaultPositionY + 'px';
    }

    getDefaultPosition() {
        return {
            defaultPositionX: this.defaultPositionX,
            defaultPositionY: this.defaultPositionY
        }
    }
    

    onClick(event: any) {
        event.preventDefault();

        let pos3 = event.clientX;
        let pos4 = event.clientY;

        let nativeElement = this.elementRef.nativeElement;
        nativeElement.style.pointerEvents = "none";
        
        let eventFunction = function(e: any) {
            e.preventDefault();

            let pos1: number = pos3 - e.clientX;
            let pos2: number = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
    
            nativeElement.style.top = (nativeElement.offsetTop - pos2) + "px";
            nativeElement.style.left = (nativeElement.offsetLeft - pos1) + "px";
        }

        if (event.target.id == nativeElement.id) {
            this.dragOn.nativeElement.addEventListener('mousemove', eventFunction);
        }

        this.listeners.push({
            event: 'mousemove',
            function: eventFunction
        });
    }

    removeMouseMoveListeners() {
        for (let i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i].event == 'mousemove') {
                this.dragOn.nativeElement.removeEventListener(this.listeners[i].event, this.listeners[i].function)
                this.listeners.splice(i, 1);

                let nativeElement = this.elementRef.nativeElement;
                nativeElement.style.pointerEvents = "auto";
            }
        }
    }
}