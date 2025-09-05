import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  // spinner.service.ts
  private spinnerVisibleSubject = new BehaviorSubject<boolean>(false);
  spinnerVisible$ = this.spinnerVisibleSubject.asObservable();

  show() {
    this.spinnerVisibleSubject.next(true);
  }

  hide() {
    this.spinnerVisibleSubject.next(false);
  }
}
