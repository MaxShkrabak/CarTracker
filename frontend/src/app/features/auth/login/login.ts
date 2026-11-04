import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth-service';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  loading = signal(false);
  hidePassword = signal(true);

  protected readonly Eye = Eye;
  protected readonly EyeOff = EyeOff;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  onLogin() {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.toastr.error(
          err.status === 0 ? 'Cannot reach the server.' : 'Incorrect username or password.',
          'Login',
        );
      },
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update((v) => !v);
  }
}
