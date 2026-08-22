import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../../core/auth';
import { passwordRules } from '../../password-rules';

type Step = 'email' | 'token' | 'password';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private auth = inject(AuthService);
  private router = inject(Router);

  step = signal<Step>('email');
  email = signal('');
  token = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  loading = signal(false);

  rules = computed(() => passwordRules(this.newPassword()));

  // User requesting token to reset password
  onSendToken() {
    const email = this.email().trim();

    if (!email || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.auth.forgotPassword({ email : this.email() }).subscribe({
      next: () => { this.step.set('token'); this.loading.set(false);},
      error: () => { this.step.set('token'); this.loading.set(false);},
    });
  }

  // User pastes in the received token
  onVerifyToken() {
    this.loading.set(true);
    this.error.set(null);
    this.auth.verifyToken({ email: this.email(), token: this.token() }).subscribe({
      next: () => { this.step.set('password'); this.loading.set(false);},
      error: () => { this.error.set('Token is invalid or expired.'); this.loading.set(false);},
    });
  }

  // User resets their password
  onResetPassword() {
    if (this.rules().some(r => !r.met)) {
      this.error.set('Password does not meet all requirements.');
      return;
    }

    if (this.newPassword() != this.confirmPassword()) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.auth.resetPassword({ email: this.email(), token: this.token(), newPassword: this.newPassword() }).subscribe({
      next: () => { this.router.navigate(['/login']); this.loading.set(false); },
      error: () => { this.error.set('Could not reset the password. Please try again.'); this.loading.set(false);},
    });
  }
}
