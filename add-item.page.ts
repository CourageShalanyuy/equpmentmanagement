import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { v4 as uuidv4 } from 'uuid';

// Import your inventory service (you'll need to create this)
// import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
  standalone: false,
})
export class AddItemPage implements OnInit {
  itemForm: FormGroup;
  isEditMode = false;
  editingItemId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController // private inventoryService: InventoryService
  ) {
    this.itemForm = this.createForm();
  }

  ngOnInit() {
    // Check if we're in edit mode (you'll need to implement this logic)
    // For now, we're just creating a new item
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
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;

      // Prepare the item data
      const newItem = {
        id: uuidv4(), // Generate unique ID
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
            : [formValue.status], // Default to the main status if no individual conditions
      };

      try {
        // Save the item (you'll need to implement this in your service)
        // await this.inventoryService.addItem(newItem);

        // For now, we'll just log it and show a success message
        console.log('New item:', newItem);

        // Show success alert
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Item added successfully!',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.router.navigate(['/home']);
              },
            },
          ],
        });

        await alert.present();
      } catch (error) {
        console.error('Error saving item:', error);
        this.showErrorAlert('Failed to save item. Please try again.');
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
    this.router.navigate(['/home']);
  }
}
