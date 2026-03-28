import { Component } from '@angular/core';

@Component({
  selector: 'app-email-compose',
  template: `
    <div class="email-container">
      <h2>Compose Email Outreach</h2>
      <mat-card>
        <mat-card-content>
          <form class="email-form">
            <mat-form-field appearance="fill">
              <mat-label>To (Comma separated or Bulk)</mat-label>
              <input matInput placeholder="recipient@example.com">
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Subject</mat-label>
              <input matInput placeholder="Subject">
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Template Name</mat-label>
              <input matInput value="lead-outreach" disabled>
            </mat-form-field>

            <button mat-raised-button color="accent">Send Email</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: ['.email-container { padding: 20px; }', '.email-form { display: flex; flex-direction: column; }']
})
export class EmailComposeComponent {
  // Email sending logic
}
