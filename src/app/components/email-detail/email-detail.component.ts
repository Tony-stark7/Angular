import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { AuthService } from '../../services/auth.service';
import { EmailDetail } from '../../models/email';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-email-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-detail.component.html',
  styleUrls: ['./email-detail.component.scss']
})
export class EmailDetailComponent implements OnInit {
  emailId: string = '';
  email: EmailDetail | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emailService: EmailService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.emailId = id;
        this.fetchEmailDetail();
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  fetchEmailDetail(): void {
    this.loading = true;
    this.emailService.getEmailDetail(this.emailId).subscribe({
      next: (response) => {
        this.email = response.email;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching email detail:', error);
        this.error = 'Failed to load email details. Please try again.';
        this.loading = false;
        
        // If unauthorized, redirect to login
        if (error.status === 401) {
          this.authService.logout();
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
