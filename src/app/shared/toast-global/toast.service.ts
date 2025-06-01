import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ToastType = 'success' | 'danger' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<{ message: string; type: ToastType }>();

  get toast$(): Observable<{ message: string; type: ToastType }> {
    return this.toastSubject.asObservable();
  }

  show(message: string, type: ToastType = 'info') {
    this.toastSubject.next({ message, type });
  }
}
