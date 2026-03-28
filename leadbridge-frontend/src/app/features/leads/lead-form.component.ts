import { Component } from '@angular/core';

@Component({
  selector: 'app-lead-form',
  template: `
    <h2 mat-dialog-title>Lead Form</h2>
    <mat-dialog-content>
      <form class="lead-form">
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput placeholder="Enter Name">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput type="email" placeholder="Enter Email">
        </mat-form-field>
        
        <mat-form-field appearance="fill">
          <mat-label>Status</mat-label>
          <mat-select>
            <mat-option value="NEW">NEW</mat-option>
            <mat-option value="CONTACTED">CONTACTED</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary">Save</button>
    </mat-dialog-actions>
  `,
  styles: ['.lead-form { display: flex; flex-direction: column; min-width: 300px; }']
})
export class LeadFormComponent {
  // Logic for add/edit lead
}
