import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { InventoryService, InventoryItem } from '../../services/inventory';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
  standalone: false,
})
export class EditItemPage implements OnInit {
  itemForm: FormGroup;
  itemId: string = '';
  originalItem: InventoryItem | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private inventoryService: InventoryService
  ) {
    this.itemForm = this.createForm();
  }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id') || '';
    this.loadItemData();
  }

  loadItemData() {
    const item = this.inventoryService.getItemById(this.itemId);
    if (item) {
      this.originalItem = item;
      this.itemForm.patchValue({
        name: item.name,
        description: item.description,
        category: item.category,
        location: item.location,
        quantity: item.quantity,
        price: item.price,
        status: item.status,
        purchaseDate: item.purchaseDate,
        imageUrl: item.imageUrl || '',
        conditionStatuses: item.conditionStatuses || [],
      });
    } else {
      this.showErrorAlert('Item not found');
      this.router.navigate(['/home']);
    }
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      location: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      status: ['Good', Validators.required],
      purchaseDate: [new Date().toISOString()],
      imageUrl: [''],
      conditionStatuses: [[]],
    });
  }

  async saveItem() {
    if (this.itemForm.valid && this.originalItem) {
      const formValue = this.itemForm.value;

      // Prepare the updated item data
      const updatedItem: InventoryItem = {
        ...this.originalItem, // Keep original ID and other properties
        name: formValue.name,
        description: formValue.description,
        category: formValue.category,
        location: formValue.location,
        quantity: formValue.quantity,
        price: formValue.price,
        status: formValue.status,
        purchaseDate: formValue.purchaseDate,
        imageUrl: formValue.imageUrl,
        conditionStatuses:
          formValue.conditionStatuses && formValue.conditionStatuses.length > 0
            ? formValue.conditionStatuses
            : [formValue.status],
      };

      try {
        // Update the item
        this.inventoryService.updateItem(updatedItem);

        // Show success alert
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Item updated successfully!',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.router.navigate(['/item-detail', this.itemId]);
              },
            },
          ],
        });

        await alert.present();
      } catch (error) {
        console.error('Error updating item:', error);
        this.showErrorAlert('Failed to update item. Please try again.');
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.itemForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  cancel() {
    this.router.navigate(['/item-detail', this.itemId]);
  }
}
