import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagApiService } from '../../../services/rag-api.service';
import { ToastrService } from 'ngx-toastr';

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
  typingSpeed: number = 10;
  chatStatus: string = 'Online';
  constructor(
    private router: Router,
    private ragApiService: RagApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.messages = [
      {
        content: 'Hello! Tara here. What can I assist you with today?',
        sender: 'bot',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
        isTyping: false,
        fullContent: 'Hello! Tara here. What can I assist you with today?'
      }
    ];
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') return;

    this.messages.push({
      content: this.newMessage,
      sender: 'user',
      timestamp: new Date(),
      isTyping: false
    });

    let message = this.newMessage;
    this.newMessage = '';
    this.isLoading = true;
    this.scrollToBottom();
    this.sessionId = localStorage.getItem('session_id') || '';
    this.ragApiService.queryPdf(this.sessionId, message).subscribe(
      (response: any) => {
        this.chatStatus = 'Online';
        this.isLoading = false;
        const botMessage = {
          content: '',
          sender: 'bot',
          timestamp: new Date(),
          isTyping: true,
          fullContent: response.answer
        };
        this.messages.push(botMessage);
        this.scrollToBottom();
        this.typeMessage(botMessage);
      },
      (error: any) => {
        this.toastr.error(error);
        this.isLoading = false;
        this.chatStatus = 'Offline'
        const errorMessage = {
          content: '',
          sender: 'bot',
          timestamp: new Date(),
          isTyping: true,
          fullContent: 'Sorry about that! I ran into a little hiccup. Please try again shortly. – Tara'
        };

        this.messages.push(errorMessage);
        this.scrollToBottom();
        this.typeMessage(errorMessage);
      }
    );
  }

  typeMessage(message: any): void {
    let i = 0;
    const fullText = message.fullContent;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        message.content = fullText.substring(0, i + 1);
        i++;
        this.scrollToBottom();
      } else {
        clearInterval(interval);
        message.isTyping = false;
      }
    }, this.typingSpeed);
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
