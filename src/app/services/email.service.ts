import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailListResponse, EmailDetailResponse } from '../models/email';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getEmails(): Observable<EmailListResponse> {
    return this.http.get<EmailListResponse>(`${this.apiUrl}/emails`, {
      headers: this.getHeaders()
    });
  }

  getEmailDetail(emailId: string): Observable<EmailDetailResponse> {
    return this.http.get<EmailDetailResponse>(`${this.apiUrl}/emails/${emailId}`, {
      headers: this.getHeaders()
    });
  }
}
