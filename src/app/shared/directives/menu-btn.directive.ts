import {AfterViewInit, Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appMenuBtn]'
})
export class MenuBtnDirective implements AfterViewInit{
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
      this.el.nativeElement.style.backgroundImage = "url('assets/icons/" + this.el.nativeElement
        .getAttribute("data-image") + "')";
  }

  @HostListener('mouseover')
  onMouseOver() {
    this.el.nativeElement.style.backgroundImage = "url('assets/icons-active/" + this.el.nativeElement
      .getAttribute("data-image") + "')";
  }

  @HostListener('mouseout')
  onMouseOut() {
    this.el.nativeElement.style.backgroundImage = "url('assets/icons/" + this.el.nativeElement
      .getAttribute("data-image") + "')";
  }
}
