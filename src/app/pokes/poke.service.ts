import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class PokeService {
  constructor(private http: HttpClient, private router: Router) {}
  getUser(userId) {
    return this.http.get(`http://localhost:92/api/users/${userId}`);
  }
  updatePoking() {
    const userId = localStorage.getItem("userId")
    const user = { toUserId: userId };
    const fromUserId = localStorage.getItem('userId');
    this.http
      .put(`http://localhost:92/api/users/poking/${userId}`, user)
      .subscribe((response) => {
        this.router.navigate(['/pokes']);
      });
  }
}
