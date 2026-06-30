import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appAdminOnly]',
  standalone: true,
})
export class AdminOnlyDirective implements OnChanges {
  @Input('appAdminOnly') usuario: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    if (this.usuario?.perfil === 'administrador') {
      this.renderer.setStyle(this.el.nativeElement, 'display', '');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
  }
}