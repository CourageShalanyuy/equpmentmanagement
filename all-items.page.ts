import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService, InventoryItem } from '../../services/inventory';

interface InventorySummary {
  totalItems: number;
  goodCondition: number;
  needsMaintenance: number;
  damaged: number;
  totalValue: number;
}

@Component({
  selector: 'app-all-items',
  templateUrl: './all-items.page.html',
  styleUrls: ['./all-items.page.scss'],
  standalone: false,
})
export class AllItemsPage implements OnInit {
  inventoryItems: InventoryItem[] = [];
  sortedItems: InventoryItem[] = [];
  sortAscending = false;

  inventorySummary: InventorySummary = {
    totalItems: 0,
    goodCondition: 0,
    needsMaintenance: 0,
    damaged: 0,
    totalValue: 0,
  };

  constructor(
    private router: Router,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.loadInventoryData();
    this.calculateSummary();
  }

  loadInventoryData() {
    this.inventoryItems = this.inventoryService.getAllItems();
    this.sortItems();
  }

  sortItems() {
    this.sortedItems = [...this.inventoryItems].sort((a, b) => {
      const dateA = new Date(a.purchaseDate).getTime();
      const dateB = new Date(b.purchaseDate).getTime();
      return this.sortAscending ? dateA - dateB : dateB - dateA;
    });
  }

  toggleSortOrder() {
    this.sortAscending = !this.sortAscending;
    this.sortItems();
  }

  calculateSummary() {
    this.inventorySummary = {
      totalItems: this.inventoryItems.length,
      goodCondition: this.inventoryItems.filter(
        (item) => item.status === 'Good'
      ).length,
      needsMaintenance: this.inventoryItems.filter(
        (item) => item.status === 'Needs Maintenance'
      ).length,
      damaged: this.inventoryItems.filter((item) => item.status === 'Damaged')
        .length,
      totalValue: this.inventoryItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    };
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Good':
        return 'success';
      case 'Needs Maintenance':
        return 'warning';
      case 'Damaged':
        return 'danger';
      default:
        return 'medium';
    }
  }

  viewItemDetails(item: InventoryItem) {
    this.router.navigate(['/item-detail', item.id]);
  }

  navigateToAddItem() {
    this.router.navigate(['/add-item']);
  }
}
