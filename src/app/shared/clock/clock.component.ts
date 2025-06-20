import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clock',
  imports: [DatePipe],
  template: `
    <div [class]="containerClass">
      <div [class]="dataClass">{{ time | date : 'dd/MM/yyyy' }}</div>
      <div [class]="horaClass">{{ time | date : 'HH:mm:ss' }}</div>
    </div>
  `,
})
export class ClockComponent implements OnDestroy, OnInit {
  time = new Date();
  @Input() containerClass: string =
    'rounded bg-secondary text-white m-2 text-center';
  @Input() dataClass: string = 'fs-4';
  @Input() horaClass: string = 'display-2';

  observable1 = interval(1000);
  subscripition: any;

  ngOnInit(): void {
    this.subscripition = this.observable1.subscribe(() => {
      this.time = new Date();
    });
  }

  ngOnDestroy() {
    this.subscripition.unsubscribe();
    this.subscripition = null;
  }
}
