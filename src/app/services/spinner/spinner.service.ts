import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private status = new BehaviorSubject<boolean>(false);
  status$ = this.status.asObservable();

  constructor() {}

  getStatus() {
    return this.status.asObservable();
  }

  show(status: boolean): void {
    this.status.next(status);
  }
}
