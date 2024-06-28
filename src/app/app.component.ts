import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/basic/header/header.component';
import { MenuComponent } from './components/basic/menu/menu.component';
import { SpinnerComponent } from './components/basic/spinner/spinner.component';
import { EstacionesComponent } from './components/map/estaciones/estaciones.component';
import { AuthService } from './services/auth/auth.service';
import { SpinnerService } from './services/spinner/spinner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MatButtonModule,
    MatSidenavModule,
    HeaderComponent,
    MenuComponent,
    SpinnerComponent,
    EstacionesComponent,
    CommonModule,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'material-responsive-sidenav';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = true;
  isCollapsed = true;
  islogueado = false;

  spinnerStatus: boolean = false;

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    public spinnerService: SpinnerService,
    private auth: AuthService
  ) {
    this.spinnerService.status$.subscribe((status) => {
      this.spinnerStatus = status;
    });
    if (this.auth.getToken() != null) {
      this.islogueado = true;
    }
  }

  ngOnInit() {
    this.auth.dataState.subscribe((res) => {
      this.islogueado = res;
    });

    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
      this.isCollapsed = !this.isCollapsed;
    }
  }

  changeComponent(path: string) {
    this.router.navigate([path]);
  }

  authenticate() {
    if (this.islogueado) {
      this.auth.logout();
      this.auth.recieve(false);
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['login']);
    }
  }
}
