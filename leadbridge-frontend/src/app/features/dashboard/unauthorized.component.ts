import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div style="padding:80px; text-align:center;">
      <h2>Unauthorized</h2>
      <p>Your account has no role assigned in LeadBridge.</p>
      <p>Contact LeadPro admin to get access.</p>
      <button mat-raised-button (click)="authService.logout()">Logout</button>
    </div>
  `
})
export class UnauthorizedComponent {
  constructor(public authService: AuthService) {}
}
