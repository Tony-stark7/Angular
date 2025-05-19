import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getAuthUrl(): Observable<{ auth_url: string }> {
    return this.http.get<{ auth_url: string }>(`${this.apiUrl}/auth/google`);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  handleCallback(token: string): void {
    this.setToken(token);
    this.router.navigate(['/home']);
  }
}
