import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor() { }

  // ✅ Accept the entire user object and store relevant data
  login(user: any) {
    this.loggedIn = true;

    // Save login status
    localStorage.setItem('loggedIn', 'true');

    // Save customerId (or userId, username, etc.)
    localStorage.setItem('customerId', user.id); // <-- Assuming user has an 'id' property
    localStorage.setItem('username', user.username); // Optional: store username
  }

  logout() {
    this.loggedIn = false;

    // Remove all user data
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('customerId');
    localStorage.removeItem('username');
  }

  isLoggedIn(): boolean {
    const status = localStorage.getItem('loggedIn');
    return status === 'true';
  }

  // ✅ New method to get the logged-in customer's ID
  getLoggedInCustomerId(): number | null {
    const id = localStorage.getItem('customerId');
    return id ? Number(id) : null;
  }

  // ✅ Optional method to get the username
  getLoggedInUsername(): string | null {
    return localStorage.getItem('username');
  }
}