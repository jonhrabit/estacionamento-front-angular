import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast-global',
  templateUrl: './toast-global.component.html',
  imports: [CommonModule]
})
export class ToastGlobalComponent implements OnInit, OnDestroy {
  show = false;
  message = '';
  type: ToastType = 'info';
  private sub?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.sub = this.toastService.toast$.subscribe(({ message, type }) => {
      this.message = message;
      this.type = type;
      this.show = true;
      setTimeout(() => this.show = false, 3000);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
