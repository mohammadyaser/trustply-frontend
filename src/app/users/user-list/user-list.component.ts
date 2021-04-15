import { Component, OnDestroy, OnInit } from '@angular/core';

import { User } from '../user.model';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { MatExpansionPanel } from '@angular/material/expansion';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  isUserAuthenticated = false;
  userId: any;
  private userSub!: Subscription;
  private authSub!: Subscription;
  constructor(
    public userService: UserService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.isLoading = true;
    this.userId = localStorage.getItem('userId');
    this.userService.getUsers();
    this.userSub = this.userService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.isLoading = false;
        this.users = users;
      });
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuth) => {
        this.isUserAuthenticated = isAuth;
      });
  }

  onPoke(userId) {
    this.userService.sendPoking(userId);
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
