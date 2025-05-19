import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { AuthService } from '../../services/auth.service';
import { Email } from '../../models/email';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  emails: Email[] = [];
  loading = true;
  error = '';

  constructor(
    private emailService: EmailService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchEmails();
  }

  fetchEmails(): void {
    this.loading = true;
    this.emailService.getEmails().subscribe({
      next: (response) => {
        this.emails = response.emails;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching emails:', error);
        this.error = 'Failed to load emails. Please try again.';
        this.loading = false;
        
        // If unauthorized, redirect to login
        if (error.status === 401) {
          this.authService.logout();
        }
      }
    });
  }

  viewEmail(emailId: string): void {
    this.router.navigate(['/email', emailId]);
  }

  logout(): void {
    this.authService.logout();
  }
}
