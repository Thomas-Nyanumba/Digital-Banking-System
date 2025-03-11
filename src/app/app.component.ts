import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Digital_Banking_Platform';
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.isLoginPage = this.router.url === '/login' || this.router.url === '/';
    });
  }
}
