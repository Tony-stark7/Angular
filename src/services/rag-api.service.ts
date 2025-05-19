import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RagApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  uploadPdf(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  queryPdf(sessionId: string, question: string, generateAudio: boolean = false): Observable<any> {
    return this.http.post(`${this.apiUrl}/query`, {
      session_id: sessionId,
      question: question,
      generate_audio: generateAudio
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors and provide meaningful error messages
   * @param error The HTTP error response
   * @returns An observable with a user-friendly error message
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.error('Client error:', error.error.message);
    } else {
      // Server-side error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );
      
      // Customize error messages based on status codes
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 403:
          errorMessage = 'Access forbidden. You don\'t have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Resource not found. The requested data might have been removed.';
          break;
        case 408:
          errorMessage = 'Request timeout. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later or contact support.';
          break;
        case 503:
          errorMessage = 'Service unavailable. The server is currently unable to handle the request.';
          break;
        default:
          errorMessage = `Server error: ${error.message}`;
      }
    }
    
    // You can also add logging to a monitoring service here
    
    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }
}