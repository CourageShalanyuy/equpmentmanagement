import { Injectable } from '@angular/core';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  quantity: number;
  price: number;
  status: 'Good' | 'Needs Maintenance' | 'Damaged';
  purchaseDate: string;
  conditionStatuses: string[];
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Classic Wooden Chair',
      description: 'High-quality wooden chair for office use',
      category: 'Furniture',
      location: 'Conference Room A',
      quantity: 4,
      price: 78630,
      status: 'Good',
      purchaseDate: '2022-03-15',
      conditionStatuses: ['Good', 'Good', 'Good', 'Damaged'],
      imageUrl:
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop',
    },
    {
      id: '2',
      name: 'Modern Leather Sofa',
      description: 'Executive leather sofa for reception area',
      category: 'Furniture',
      location: 'Main Lobby',
      quantity: 1,
      price: 557175,
      status: 'Damaged',
      purchaseDate: '2021-11-20',
      conditionStatuses: ['Damaged'],
      imageUrl:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    },
    {
      id: '3',
      name: 'Ergonomic Office Desk',
      description: 'Adjustable height desk with cable management',
      category: 'Furniture',
      location: 'Executive Office',
      quantity: 2,
      price: 294975,
      status: 'Needs Maintenance',
      purchaseDate: '2022-01-10',
      conditionStatuses: ['Good', 'Needs Maintenance'],
      imageUrl:
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop',
    },
    {
      id: '4',
      name: 'Conference Table',
      description: 'Large table for conference rooms',
      category: 'Furniture',
      location: 'Conference Room B',
      quantity: 1,
      price: 786300,
      status: 'Good',
      purchaseDate: '2021-09-05',
      conditionStatuses: ['Good'],
      imageUrl:
        'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop',
    },
    {
      id: '5',
      name: 'Desktop Computer',
      description: 'High-performance workstation',
      category: 'Electronics',
      location: 'IT Department',
      quantity: 3,
      price: 458865,
      status: 'Good',
      purchaseDate: '2022-05-20',
      conditionStatuses: ['Good', 'Good', 'Good'],
      imageUrl:
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
    },
    {
      id: '6',
      name: 'Laptop',
      description: 'Portable business laptop',
      category: 'Electronics',
      location: 'Sales Department',
      quantity: 2,
      price: 524520,
      status: 'Good',
      purchaseDate: '2022-02-15',
      conditionStatuses: ['Good', 'Needs Maintenance'],
      imageUrl:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    },
    {
      id: '7',
      name: 'Printer',
      description: 'Color laser printer',
      category: 'Office Supplies',
      location: 'Administration',
      quantity: 1,
      price: 262260,
      status: 'Good',
      purchaseDate: '2021-12-10',
      conditionStatuses: ['Good'],
      imageUrl:
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop',
    },
  ];

  constructor() {}

  getAllItems(): InventoryItem[] {
    return this.inventoryItems;
  }

  getItemById(id: string): InventoryItem | null {
    const item = this.inventoryItems.find((item) => item.id === id);
    return item || null;
  }

  addItem(item: InventoryItem): void {
    this.inventoryItems.push(item);
  }

  updateItem(updatedItem: InventoryItem): void {
    const index = this.inventoryItems.findIndex(
      (item) => item.id === updatedItem.id
    );
    if (index !== -1) {
      this.inventoryItems[index] = updatedItem;
    }
  }

  deleteItem(id: string): void {
    this.inventoryItems = this.inventoryItems.filter((item) => item.id !== id);
  }

  getItemsByCategory(category: string): InventoryItem[] {
    return this.inventoryItems.filter((item) => item.category === category);
  }

  getItemsByStatus(status: string): InventoryItem[] {
    return this.inventoryItems.filter((item) => item.status === status);
  }
}
