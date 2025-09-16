import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { InventoryService, InventoryItem } from '../services/inventory';

interface InventorySummary {
  totalItems: number;
  goodCondition: number;
  needsMaintenance: number;
  damaged: number;
  totalValue: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  sortAscending = false;
  currentFilter = 'all';
  searchQuery = '';
  isMenuOpen = false;

  inventorySummary: InventorySummary = {
    totalItems: 0,
    goodCondition: 0,
    needsMaintenance: 0,
    damaged: 0,
    totalValue: 0,
  };

  constructor(
    private popoverController: PopoverController,
    private router: Router,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.loadInventoryData();
    this.applyFilter();
    this.calculateSummary();
  }

  async openMenu(ev?: any) {
    this.isMenuOpen = true;
  }

  loadInventoryData() {
    this.inventoryItems = this.inventoryService.getAllItems();
    this.sortItems();
  }

  // Get all unique categories from items
  getCategories(): string[] {
    const categories = new Set(this.filteredItems.map((item) => item.category));
    return Array.from(categories).sort();
  }

  // Get items by category
  getItemsByCategory(category: string): InventoryItem[] {
    return this.filteredItems.filter((item) => item.category === category);
  }

  getConditionStatuses(item: InventoryItem): string[] {
    return item.conditionStatuses || [item.status];
  }

  sortItems() {
    this.inventoryItems.sort((a, b) => {
      const dateA = new Date(a.purchaseDate).getTime();
      const dateB = new Date(b.purchaseDate).getTime();
      return this.sortAscending ? dateA - dateB : dateB - dateA;
    });
    this.applyFilter();
  }

  toggleSortOrder() {
    this.sortAscending = !this.sortAscending;
    this.sortItems();
  }

  filterByStatus(status: string) {
    this.currentFilter = status;
    this.applyFilter();
  }

  applyFilter() {
    if (this.currentFilter === 'all') {
      this.filteredItems = [...this.inventoryItems];
    } else {
      this.filteredItems = this.inventoryService.getItemsByStatus(
        this.currentFilter
      );
    }

    // Apply search filter if there's a query
    if (this.searchQuery) {
      this.filteredItems = this.filteredItems.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.category
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  searchItems(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.applyFilter();
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

  addNewItem() {
    this.router.navigate(['/add-item']);
    this.isMenuOpen = false;
  }

  viewItemDetails(item: InventoryItem) {
    this.router.navigate(['/item-detail', item.id]);
  }
  navigateToAllItems() {
    this.router.navigate(['/all-items']);
    this.isMenuOpen = false;
  }
}
