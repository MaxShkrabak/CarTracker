import { Component, signal, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth';
import { passwordRules, PasswordRule } from '../../password-rules';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  username = '';
  password = '';
  confirmpassword = '';
  errorMessage = signal('');
  loading = signal(false);

  shakeRules = false;
  shakeInvalid = false;
  passwordMismatch = false;

  get rules(): PasswordRule[] {
    return passwordRules(this.password);
  }

  onRegister(form: NgForm) {
    this.errorMessage.set('');
    this.passwordMismatch = false;
    this.shakeRules = false;
    this.shakeInvalid = false;

    if (form.invalid) {
      form.form.markAllAsTouched();
      this.shakeInvalid = true;
      this.errorMessage.set('Please make sure all required fields are filled out correctly.');
      return;
    }

    // verify password rules
    if (this.rules.some((r) => !r.met)) {
      this.shakeRules = true;
      return;
    }

    // verify passwords match
    if (this.password != this.confirmpassword) {
      this.passwordMismatch = true;
      this.errorMessage.set('Passwords do not match');
      this.shakeInvalid = true;
      return;
    }

    this.loading.set(true);
    const [firstName, lastName = ''] = this.fullName.split(/\s+/);

    // TODO: Need input field verification

    this.authService
      .register({
        username: this.username,
        firstName,
        lastName,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading.set(false);

          if (err.status === 0) {
            this.errorMessage.set('Cannot reach the server');
          } else if (err.status === 409) {
            this.errorMessage.set('This username is already taken.');
          } else {
            this.errorMessage.set('Registration failed. Please try again.');
          }
        },
      });
  }
}
