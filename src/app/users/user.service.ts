import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class UserService {
  private users: any = [];
  private usersUpdated = new Subject<User[]>();
  private poking = new Subject<any[]>();
  constructor(private http: HttpClient, private router: Router) {}
  getUser(userId) {
    return this.http.get(`http://localhost:92/api/users/${userId}`);
  }
  getUsers() {
    this.http
      .get<{ message: string; users: any }>('http://localhost:92/api/users')
      .subscribe((response: any) => {
        this.users = response?.result;
        let userId = localStorage.getItem('userId');
        // this.users = this.users.filter((user) => user.id != userId);
        this.usersUpdated.next([...this.users]);
      });
  }
  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }
  getUserPokingListener() {
    return this.poking.asObservable();
  }
  addUser(name: string, email: string) {
    const user: User = { name: name, email: name };
    this.http
      .post<{ message: string }>('http://localhost:92/api/users/user', user)
      .subscribe((message) => {
        console.log(message);
        this.users.push(user);
        this.usersUpdated.next([...this.users]);
      });
    this.router.navigate(['/']);
  }
  updateUser(id: string, name: string) {
    const user = { id, name };
    this.http
      .put(`http://localhost:92/api/users/${id}`, user)
      .subscribe((response) => {
        this.users = this.users.map((u) => {
          if (u.id === id) {
            u.name = name;
          }
          return u;
        });
        this.usersUpdated.next([...this.users]);
        this.router.navigate(['/user']);
      });
  }
  sendPoking(userId) {
    const user = { toUserId: userId, info: 'poked' };
    const fromUserId = localStorage.getItem('userId');
    this.http
      .post(`http://localhost:92/api/users/poking/${fromUserId}`, user)
      .subscribe((response) => {
        this.router.navigate(['/user']);
      });
  }
  getPoking() {
    const userId = localStorage.getItem('userId');
    this.http
      .get(`http://localhost:92/api/users/poking/${userId}`)
      .subscribe((response: any) => {
        const countPoking = response.result.length;
        console.log('*********************', countPoking);
        this.poking.next(countPoking)
      });
  }
}
