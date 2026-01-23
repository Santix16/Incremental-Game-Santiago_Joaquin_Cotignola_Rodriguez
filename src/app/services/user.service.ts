import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  login(username: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}?username=${username}&password=${password}`);
  }

  getRanking(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}?_sort=points&_order=desc`);
  }
}
