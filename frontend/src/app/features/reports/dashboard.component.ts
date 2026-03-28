import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <h2>Area Reports Dashboard</h2>
      
      <div class="cards">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Total Leads</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h1>120</h1>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Conversion Rate</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h1>5.0%</h1>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Chart area placeholder -->
      <div class="chart-area mt-3">
        <mat-card>
          <mat-card-content>
            <p>Lead Status Breakdown Chart (ng2-charts placeholder)</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px; }
    .cards { display: flex; gap: 20px; }
    .stat-card { min-width: 200px; text-align: center; }
    .mt-3 { margin-top: 20px; }
  `]
})
export class DashboardComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
