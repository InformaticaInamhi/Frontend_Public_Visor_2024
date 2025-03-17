import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { TitleService } from '../../services/header/title.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginFormUser = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private notifications: NotificationsService,
    private route: Router,
    private auth: AuthService,
    private spinnerService: SpinnerService,
    private titleService: TitleService
  ) {
    this.titleService.changeTitle('');
  }

  ngOnInit(): void {
    if (this.auth.getToken()) {
      this.route.navigate(['/']);
    }
  }

  onSubmit() {
    if (this.loginFormUser.invalid) {
      this.notifications.openSnackBar(
        'El formulario contiene errores',
        'X',
        'custom-styleRed'
      );
      return;
    }

    this.authService.clearSession();

    if (this.loginFormUser.valid) {
      this.spinnerService.show(true);
      const { email, password } = this.loginFormUser.value;
      if (typeof email === 'string' && typeof password === 'string') {
        this.authService.login({ email, password }).subscribe({
          next: (data) => {
            this.spinnerService.show(false);
            this.authService.saveToken(data.access_token);
            this.authService.saveUser(data.user);
            this.notifications.openSnackBar(
              `Bienvenido ${this.authService.getUser().name}`,
              '',
              'custom-styleGreen'
            );

            this.auth.recieve(true);
            this.route.navigateByUrl('/');
          },
          error: (err) => {
            this.spinnerService.show(false);
            const errors = err.error;
            let message = 'Ha ocurrido un error desconocido.';

            if (errors) {
              const errorMessages: string[] = [];
              Object.entries(errors).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                  errorMessages.push(...value.map(String));
                }
              });
              message = errorMessages.join(' ');
            }

            this.notifications.openSnackBar(message, 'X', 'custom-styleRed');
          },
        });
      }
    }
  }
}
