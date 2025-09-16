import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { InventoryService, InventoryItem } from '../../services/inventory';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
  standalone: false,
})
export class ItemDetailPage implements OnInit {
  item: InventoryItem | null = null;
  itemId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id') || '';
    this.loadItemDetails();
  }

  loadItemDetails() {
    const foundItem = this.inventoryService.getItemById(this.itemId);

    if (foundItem) {
      this.item = foundItem;
    } else {
      this.showErrorAlert('Item not found');
      this.router.navigate(['/home']);
    }
  }

  getConditionStatuses(item: InventoryItem): string[] {
    return item.conditionStatuses || [item.status];
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

  editItem() {
    if (this.item) {
      this.router.navigate(['/edit-item', this.item.id]); // Updated to use correct route
    }
  }

  async deleteItem() {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${this.item?.name}? This action cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.performDelete();
          },
        },
      ],
    });

    await alert.present();
  }

  performDelete() {
    if (this.item) {
      this.inventoryService.deleteItem(this.item.id);

      // Show success message and navigate back
      this.showSuccessAlert('Item deleted successfully');
      this.router.navigate(['/home']);
    }
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
