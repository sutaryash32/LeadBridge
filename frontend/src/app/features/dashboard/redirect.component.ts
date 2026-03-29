import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './redirect.component.html',
})
export class RedirectComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.navigateByUrl(this.authService.getDashboardRoute());
  }
}
