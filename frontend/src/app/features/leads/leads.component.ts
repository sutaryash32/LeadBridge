import { Component, OnInit } from '@angular/core';
// Import your LeadService, etc.

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
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
