import { ElementRef } from "@angular/core";

export interface DraggableElementOptions {
    elementRef: ElementRef;
    dragOn: ElementRef;
    defaultPositionX: number;
    defaultPositionY: number;
}