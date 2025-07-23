// core/services/task/task.ts
import { Injectable } from '@angular/core';
import { Task } from '../../../model/user.model';
import { Observable, of, Subject, throwError } from 'rxjs'; // Added throwError
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient and HttpHeaders
import { catchError, tap } from 'rxjs/operators'; // Added tap

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public tasksUpdated$ = new Subject<void>();
  private apiUrl = '/api/tasks'; // Your backend API endpoint for tasks

  constructor(private http: HttpClient) { // Inject HttpClient
    // No longer need to add sample data for demo from local storage
    // if (!this.localStorage.getTasks()) {
    //   this.addSampleDataForDemo();
    // }
  }

  private getToken(): string | null {
    // Get token from AuthService directly
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return token;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getTasks(): Observable<Task[]> {
    // Make HTTP GET request to backend
    return this.http.get<Task[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError<Task[]>('getTasks', []))
    );
  }

  getTasksByProject(projectId: string): Observable<Task[]> {
    // Assuming backend supports filtering by project ID
    return this.http.get<Task[]>(`${this.apiUrl}?projectId=${projectId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError<Task[]>('getTasksByProject', []))
    );
  }

  getTaskById(id: string): Observable<Task> { // Changed return type to Task (not Task | undefined) as backend should return 404
    // Make HTTP GET request for a single task
    return this.http.get<Task>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError<Task>('getTaskById'))
    );
  }

  addTask(newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assigneeId' | 'attachments' | 'progress' | 'storyPoints' | 'sprintId' | 'completionDate' | 'actualHours' | 'estimatedHours' | 'startTime' | 'endTime' | 'tags' | 'project'>): Observable<Task> { // Adjusted Omit type for clarity based on backend model
    // Make HTTP POST request to backend
    return this.http.post<Task>(this.apiUrl, newTask, { headers: this.getAuthHeaders() }).pipe(
      tap(() => this.tasksUpdated$.next()), // Notify subscribers that tasks have changed
      catchError(this.handleError<Task>('addTask'))
    );
  }

  updateTask(updatedTask: Task): Observable<Task> {
    // Make HTTP PUT request to backend
    return this.http.put<Task>(`${this.apiUrl}/${updatedTask.id}`, updatedTask, { headers: this.getAuthHeaders() }).pipe(
      tap(() => this.tasksUpdated$.next()), // Notify subscribers
      catchError(this.handleError<Task>('updateTask'))
    );
  }

  deleteTask(taskId: string): Observable<{ message: string }> {
    // Make HTTP DELETE request to backend
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${taskId}`, { headers: this.getAuthHeaders() }).pipe(
      tap(() => this.tasksUpdated$.next()), // Notify subscribers
      catchError(this.handleError<{ message: string }>('deleteTask'))
    );
  }

  // Removed addSampleDataForDemo as data will come from backend
  // private addSampleDataForDemo(): void { /* ... */ }

  getTasksByAssignee(assigneeName: string): Observable<Task[]> {
    // This now truly needs a backend call. Assuming backend can filter by assignee name/ID
    // You might need to adjust your backend's getTasks to support this query parameter
    return this.http.get<Task[]>(`${this.apiUrl}?assignee=${assigneeName}`, { headers: this.getAuthHeaders() }).pipe(
        catchError(this.handleError<Task[]>('getTasksByAssignee', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // It's good practice to re-throw the error or transform it for component-level handling
      return throwError(() => new Error(error.error?.message || `An error occurred during ${operation}`));
    };
  }
}