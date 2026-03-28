import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div style="display:flex; justify-content:center; padding:80px;">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `
})
export class RedirectComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.navigateByUrl(this.authService.getDashboardRoute());
  }
}
