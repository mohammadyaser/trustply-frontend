import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../users/user.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  countPoking:any;
  private authListenerSubs: Subscription;
  private userListenerSubs: Subscription;
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.userListenerSubs = this.userService
      .getUserPokingListener()
      .subscribe((poking) => {
        this.countPoking = poking;
      });
  }

  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
  onSearchChange(searchValue){
    this.userService.search(searchValue);
  }
}
