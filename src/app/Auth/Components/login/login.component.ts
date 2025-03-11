import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword: boolean = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // ✅ Inject AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const { username, password } = this.loginForm.value;

    this.http.get<any[]>(`http://localhost:3001/users?username=${username}&password=${password}`)
      .subscribe(users => {
        if (users.length > 0) {
          const user = users[0];
          console.log('Login successful:', user);

          // ✅ Call AuthService to set login status
          this.authService.login(user); // You can pass user data if you want

          // ✅ Navigate to the protected route
          // this.router.navigate(['/view-accounts']);
          // this.router.navigate(['/view-statements']);
          // this.router.navigate(['/deposits']);
          // this.router.navigate(['/withdrawal']);
          // this.router.navigate(['/transferfunds']);
          this.router.navigate(['/dashboard']);





        } else {
          this.errorMessage = 'Invalid username or password.';
        }
      }, error => {
        console.error('HTTP error:', error);
        this.errorMessage = 'Something went wrong. Please try again later.';
      });
  }
}
