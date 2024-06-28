import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(public snackBar: MatSnackBar) {}

  /**
   * Function for view notification
   * @param message
   * @param action
   * @param stilo
   */
  openSnackBar(message: string, action: string, stilo: string) {
    this.snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: [stilo,'custom-snackbar-button'],
      duration: 3000,
    });
  }
}
