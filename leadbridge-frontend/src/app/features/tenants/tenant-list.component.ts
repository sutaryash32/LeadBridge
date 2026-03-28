import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tenant-list',
  template: `
    <div class="tenants-container">
      <h2>Tenant Management (Admin View)</h2>
      <button mat-raised-button color="accent">Register New Tenant</button>
      
      <table mat-table [dataSource]="dataSource" class="mat-elevation-z8 mt-3">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef> Tenant Name </th>
          <td mat-cell *matCellDef="let element"> {{element.name}} </td>
        </ng-container>

        <ng-container matColumnDef="area">
          <th mat-header-cell *matHeaderCellDef> Area </th>
          <td mat-cell *matCellDef="let element"> {{element.area}} </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="warn"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: ['.tenants-container { padding: 20px; }', '.mt-3 { margin-top: 20px; }']
})
export class TenantListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'area', 'actions'];
  dataSource = []; 

  constructor() {}
  ngOnInit(): void {}
}
