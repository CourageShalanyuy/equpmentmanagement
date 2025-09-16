import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'add-item',
    loadChildren: () =>
      import('./pages/add-item/add-item.module').then(
        (m) => m.AddItemPageModule
      ),
  },
  {
    path: 'item-detail/:id',
    loadChildren: () =>
      import('./pages/item-detail/item-detail.module').then(
        (m) => m.ItemDetailPageModule
      ),
  },
  {
    path: 'all-items',
    loadChildren: () =>
      import('./pages/all-items/all-items.module').then(
        (m) => m.AllItemsPageModule
      ),
  },
  {
    path: 'edit-item/:id', // Add this route
    loadChildren: () =>
      import('./pages/edit-item/edit-item.module').then(
        (m) => m.EditItemPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
