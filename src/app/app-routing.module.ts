import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupConfirmComponent } from './auth/signup-confirm/signup-confirm.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PokingListComponent } from './pokes/poking-list/poking-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserUpdateComponent } from './users/user-update/user-update.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent ,canActivate:[AuthGuard],
  },
  {
    path: 'user',
    component: UserListComponent, canActivate:[AuthGuard]
  },
  {
    path: 'edit/:userId',
    component: UserUpdateComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signup/confirm',
    component: SignupConfirmComponent,
  },
  {
    path: 'pokes',
    component: PokingListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [AuthGuard]
})
export class AppRoutingModule {}
