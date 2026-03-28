import { Component, OnInit } from '@angular/core';
// Import your LeadService, etc.

@Component({
  selector: 'app-leads',
  template: `
    <div class="leads-container">
      <h2>Leads Management</h2>
      <button mat-raised-button color="primary">Add Lead</button>
      
      <!-- Lead List / Table Here -->
      <table mat-table [dataSource]="dataSource" class="mat-elevation-z8 mt-3">
        <!-- Columns definition -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef> Name </th>
          <td mat-cell *matCellDef="let element"> {{element.name}} </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Status </th>
          <td mat-cell *matCellDef="let element"> {{element.status}} </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button (click)="editLead(element)"><mat-icon>edit</mat-icon></button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: ['.leads-container { padding: 20px; }', '.mt-3 { margin-top: 20px; }']
})
export class LeadsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'status', 'actions'];
  dataSource = []; // Replace with actual data from service

  constructor() {}

  ngOnInit(): void {
    // load leads
  }

  editLead(lead: any) {
    // logic to open lead-form dialog
  }
}
