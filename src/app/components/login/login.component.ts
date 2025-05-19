import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

declare var particlesJS: any; // for using the global particles.js from CDN

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  loading = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Check if we're returning from OAuth callback with a token
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.handleCallback(token);
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize particles.js after view is rendered
    particlesJS('particles-container', {
      particles: {
        number: {
          value: 60,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: { value: '#ffffff' },
        shape: {
          type: 'circle',
          stroke: { width: 0, color: '#000000' }
        },
        opacity: {
          value: 0.5,
          random: false
        },
        size: {
          value: 3,
          random: true
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          out_mode: 'out'
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'repulse' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          repulse: { distance: 100 },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  }

  login(): void {
    this.loading = true;
    this.authService.getAuthUrl().subscribe({
      next: (response) => {
        window.location.href = response.auth_url;
      },
      error: (error) => {
        console.error('Error getting auth URL:', error);
        this.loading = false;
      }
    });
  }
}
