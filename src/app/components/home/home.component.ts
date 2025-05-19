import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagApiService } from '../../../services/rag-api.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  messages: any[] = [];
  newMessage: any = '';
  sessionId: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private ragApiService: RagApiService) { }

  ngOnInit(): void {
    this.messages = [
      {
        content: 'Hello! Tara here. What can I assist you with today?',
        sender: 'bot',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 1))
      }
    ];
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') return;
    this.messages.push({
      content: this.newMessage,
      sender: 'user',
      timestamp: new Date()
    });
    let message = this.newMessage;
    this.newMessage = '';

    // Show loading indicator
    this.isLoading = true;
    this.scrollToBottom();

    this.sessionId = localStorage.getItem('session_id') || '';
    this.ragApiService.queryPdf(this.sessionId, message).subscribe(
      (response: any) => {
        // Hide loading indicator
        this.isLoading = false;
        this.messages.push({
          content: response.answer,
          sender: 'Tara',
          timestamp: new Date()
        });
        this.scrollToBottom();
      },
      (error: any) => {
        this.isLoading = false;
        this.messages.push({
          content: 'Sorry about that! I ran into a little hiccup. Please try again shortly. – Tara',
          sender: 'bot',
          timestamp: new Date()
        });
        this.scrollToBottom();
      }
    );
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  logOut() {
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }
}
