import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { GridContainerComponent } from './img-grid/grid-container.component';
import { LoginComponent, AuthGuard } from './core/auth';
import { UploadComponent } from './management/upload.component';

const routes: Routes = [
  {
    path: '',
    component: GridContainerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage',
    component: UploadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
