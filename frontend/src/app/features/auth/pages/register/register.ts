import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fullName = '';
  username = '';
  password= '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.loading = true;
    
    const [firstName, lastName = ""] = this.fullName.split(/\s+/);

    // TODO: Need input field verification

    this.authService.register({
      username: this.username, firstName, 
      lastName, password: this.password }).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.status === 0 ?
          'Cannot reach the server.' : err.error || 'Registration failed. Please try';
        }
      })
  }
}
