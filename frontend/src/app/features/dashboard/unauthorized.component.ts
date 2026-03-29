import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent {
  constructor(public authService: AuthService) {}
}
