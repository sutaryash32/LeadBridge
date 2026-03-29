import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styles: ['.tenants-container { padding: 20px; }', '.mt-3 { margin-top: 20px; }']
})
export class TenantListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'area', 'actions'];
  dataSource = []; 

  constructor() {}
  ngOnInit(): void {}
}
