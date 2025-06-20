import { Component, Input } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-spin',
  template: `
    <div class="d-flex justify-content-center align-items-center" [ngStyle]="{height: size+'px'}" *ngIf="show">
      <div class="spinner-border text-primary" [style.width.px]="size" [style.height.px]="size" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgIf, NgStyle]
})
export class SpinComponent {
  @Input() show: boolean = true;
  @Input() size: number = 32;
}
