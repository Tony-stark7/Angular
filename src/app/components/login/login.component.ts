import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RagApiService } from '../../../services/rag-api.service';
import { ToastrService } from 'ngx-toastr';

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
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private route: ActivatedRoute,    private router: Router,
    private ragApiService: RagApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }


  uploadPdf(event: any): void {
    this.loading = true;
    const file = event.target.files[0];
    this.ragApiService.uploadPdf(file).subscribe(
      (response) => {
        this.router.navigate(['/home']);
        localStorage.setItem('session_id', response.session_id);
        this.toastr.success(response.message);
        this.loading = false;
      },
      (error) => {
        this.toastr.error(`Failed to upload ${file.name}`);
        this.loading = false;
      }
    );
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
}
