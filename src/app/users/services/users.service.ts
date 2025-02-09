import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<{
        users: User[];
      }>(
        'https://dummyjson.com/users?limit=0&select=id,firstName,lastName,age,address'
      )
      .pipe(map((response) => response.users));
  }
}
