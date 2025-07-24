import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, throwError, of } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { AuthResponse, Team, User, UserRole } from '../../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:5000/api';

  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadCurrentUserFromStorage();
  }

  // Helper to check if we're in browser environment
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Helper to get authentication token from storage
  private getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  // Helper to create authenticated HTTP headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken(); // Retrieve token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '' // Attach as Bearer token
    });
  }

  // Loads current user data from storage on service initialization
  private loadCurrentUserFromStorage(): void {
    if (!this.isBrowser()) return;
    
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Failed to parse stored user data:', e);
        this.logout(); // Clear corrupted data
      }
    }
  }

  // Admin: Get all users from the backend
  adminGetAllUsers(): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`, { headers: this.getAuthHeaders() }).pipe(
      map(users => users.map(user => this.mapApiUserToUser(user))),
      catchError(error => {
        console.error('AdminGetAllUsers failed:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch users.'));
      })
    );
  }

  // Admin: Create a new user via backend API
  adminCreateUser(userData: Partial<User>): Observable<User> {
    // Ensure `_id` is not sent, as MongoDB will generate it.
    // The backend's pre-save hook will generate numericalId.
    const payload = { ...userData };
    delete payload.id; // Remove frontend 'id' as backend uses '_id'
    delete payload._id; // Ensure _id is not sent

    return this.http.post<any>(`${this.apiUrl}/admin/users`, payload, { headers: this.getAuthHeaders() }).pipe(
      map(apiUser => this.mapApiUserToUser(apiUser)), // Map the backend response to frontend User model
      catchError(error => {
        console.error('AdminCreateUser failed:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create user.'));
      })
    );
  }

  // Admin: Update an existing user via backend API
  adminUpdateUser(id: string, userData: Partial<User>): Observable<User> {
    // Only send updatable fields.
    const payload = { ...userData };
    delete payload.id; // Remove frontend 'id' from payload
    delete payload.numericalId; // numericalId shouldn't be updated via this route

    return this.http.put<any>(`${this.apiUrl}/admin/users/${id}`, payload, { headers: this.getAuthHeaders() }).pipe(
      map(apiUser => this.mapApiUserToUser(apiUser)), // Map the backend response to frontend User model
      catchError(error => {
        console.error('AdminUpdateUser failed:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update user.'));
      })
    );
  }

  // Admin: Delete a user via backend API
  adminDeleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('AdminDeleteUser failed:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete user.'));
      })
    );
  }

  // Maps backend API user response to the frontend User interface
  private mapApiUserToUser(apiUser: any): User {
    return {
      id: apiUser._id, // Map MongoDB's _id to frontend's id
      _id: apiUser._id, // Also keep _id for consistency if needed, though 'id' is primary for frontend
      numericalId: apiUser.numericalId,
      name: apiUser.name,
      username: apiUser.username,
      email: apiUser.email,
      role: apiUser.role,
      status: apiUser.status,
      phone: apiUser.phone,
      gender: apiUser.gender,
      dob: apiUser.dob,
      department: apiUser.department,
      // Ensure 'team' is always a string ID or null, regardless of how backend sends it (populated or just ID)
      team: (apiUser.team && typeof apiUser.team === 'object' && apiUser.team._id)
              ? apiUser.team._id.toString()
              : (apiUser.team ? apiUser.team.toString() : null),
      employeeType: apiUser.employeeType,
      location: apiUser.location,
      address: apiUser.address,
      about: apiUser.about,
      profileImg: apiUser.profileImg,
      password: '', // Never store or expect password in frontend User object from API responses
      notifications: apiUser.notifications,
      performance: apiUser.performance,
      completionRate: apiUser.completionRate,
    };
  }

  // Get current user from BehaviorSubject
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Logs out user by clearing stored token and user data
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  // Checks if the current user has a specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  // Checks if the user is authenticated (token and user object present)
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  // Checks if the current user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  // Registers a new user
  registerUser(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/register`, user).pipe(
      tap(response => {
        // Map the AuthResponse to a User object for storage (optional, usually navigate to login)
        const registeredUser: User = {
          id: response._id,
          _id: response._id, // Keep _id from backend
          numericalId: response.numericalId,
          name: response.name,
          username: response.username,
          email: response.email,
          role: response.role,
          status: response.status,
          profileImg: response.profileImg,
          password: '', // Password not stored here
          team: response.team // Assuming team is sent as ID string in AuthResponse
        };
        // You might choose not to store the user after registration and instead navigate to login page.
        // If you do, ensure it doesn't auto-login unless intended.
        // Example: this.storeUserData(response, false);
      }),
      catchError(error => {
        console.error('RegisterUser failed:', error);
        return throwError(() => new Error(error.error?.message || 'Registration failed.'));
      })
    );
  }

  // Logs in a user and stores their data and token
  login(credentials: { email: string; password: string }, rememberMe: boolean): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/login`, credentials).pipe(
      tap(response => {
        // Store token
        const token = response.token;
        if (this.isBrowser()) {
          if (rememberMe) {
            localStorage.setItem('authToken', token);
          } else {
            sessionStorage.setItem('authToken', token);
          }
        }

        // Map the AuthResponse to your comprehensive User interface for storing currentUser
        const loggedInUser: User = {
          id: response._id, // Map _id to id
          _id: response._id, // Keep _id as well
          numericalId: response.numericalId,
          name: response.name,
          username: response.username,
          email: response.email,
          role: response.role as UserRole,
          status: response.status,
          profileImg: response.profileImg,
          password: '', // Password is not returned in login response
          phone: response.phone,
          gender: response.gender,
          dob: response.dob,
          department: response.department,
          team: response.team, // Assumed to be string ID or null
          employeeType: response.employeeType,
          location: response.location,
          joinDate: response.joinDate,
          lastActive: response.lastActive,
          address: response.address,
          about: response.about,
          notifications: response.notifications,
          performance: response.performance,
          completionRate: response.completionRate,
        };

        // Store the mapped User object
        if (this.isBrowser()) {
          if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          } else {
            sessionStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          }
        }

        this.currentUserSubject.next(loggedInUser); // Update the BehaviorSubject
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => new Error(error.error?.message || 'Invalid credentials.'));
      })
    );
  }

  // Team methods should use '/admin/teams' as the base path
  adminGetAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/admin/teams`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Failed to fetch teams:', error);
        return throwError(() => new Error('Failed to fetch teams'));
      })
    );
  }

  adminGetTeamById(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/admin/teams/${id}`, { headers: this.getAuthHeaders() });
  }

  adminCreateTeam(teamData: Partial<Team>): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/admin/teams`, teamData, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Failed to create team:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create team'));
      })
    );
  }

  adminUpdateTeam(id: string, teamData: Partial<Team>): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/admin/teams/${id}`, teamData, { headers: this.getAuthHeaders() }).pipe(
      map(team => this.mapApiTeamToTeam(team))
    );
  }

  adminDeleteTeam(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/admin/teams/${id}`, { headers: this.getAuthHeaders() });
  }

  adminAddTeamMembers(teamId: string, memberIds: string[]): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/admin/teams/${teamId}/add-members`, { memberIds }, { headers: this.getAuthHeaders() }).pipe(
      map(team => this.mapApiTeamToTeam(team))
    );
  }

  adminRemoveTeamMembers(teamId: string, memberIds: string[]): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/admin/teams/${teamId}/remove-members`, { memberIds }, { headers: this.getAuthHeaders() }).pipe(
      map(team => this.mapApiTeamToTeam(team))
    );
  }

  private mapApiTeamToTeam(apiTeam: any): Team {
    return {
      id: apiTeam._id || apiTeam.id,
      name: apiTeam.name,
      department: apiTeam.department,
      lead: apiTeam.lead?._id || apiTeam.lead,
      members: apiTeam.membersCount || (apiTeam.members ? apiTeam.members.length : 0),
      projects: apiTeam.projectsCount || (apiTeam.projects ? apiTeam.projects.length : 0),
      completionRate: apiTeam.completionRate || 0,
      description: apiTeam.description,
      parentTeam: apiTeam.parentTeam?._id || apiTeam.parentTeam,
      subTeams: apiTeam.subTeams?.map((sub: any) => sub._id || sub) || [],
      leadDetails: apiTeam.lead,
      memberDetails: apiTeam.members,
      projectDetails: apiTeam.projects,
      createdAt: apiTeam.createdAt,
      updatedAt: apiTeam.updatedAt
    };
  }

  // ================== ADMIN PROJECT METHODS ==================

  // Get all projects
  adminGetAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/projects`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Failed to fetch projects:', error);
        return throwError(() => new Error('Failed to fetch projects'));
      })
    );
  }

  // Get project by ID
  adminGetProjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/projects/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Failed to fetch project:', error);
        return throwError(() => new Error('Failed to fetch project'));
      })
    );
  }

  // Create a new project
  adminCreateProject(projectData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/projects`, projectData, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Failed to create project:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create project'));
      })
    );
  }

  // Update an existing project
  adminUpdateProject(id: string, projectData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/projects/${id}`, projectData, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Failed to update project:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update project'));
      })
    );
  }

  // Delete a project
  adminDeleteProject(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/projects/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Failed to delete project:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete project'));
      })
    );
  }

  // ================== ADMIN SPRINT METHODS ==================

  // Get all sprints
  adminGetAllSprints(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/sprints`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Failed to fetch sprints:', error);
        return throwError(() => new Error('Failed to fetch sprints'));
      })
    );
  }

  // Get sprints by project ID
  adminGetSprintsByProject(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/sprints/project/${projectId}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Failed to fetch sprints for project:', error);
        return throwError(() => new Error('Failed to fetch sprints for project'));
      })
    );
  }

  // Create a new sprint
  adminCreateSprint(sprintData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/sprints`, sprintData, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Failed to create sprint:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create sprint'));
      })
    );
  }

  // Update an existing sprint
  adminUpdateSprint(id: string, sprintData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/sprints/${id}`, sprintData, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Failed to update sprint:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update sprint'));
      })
    );
  }

  // Delete a sprint
  adminDeleteSprint(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/sprints/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Failed to delete sprint:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete sprint'));
      })
    );
  }

  // ================== REFRESH NOTIFICATIONS ==================
  
  private refreshTeamsSubject = new Subject<void>();
  refreshTeams$ = this.refreshTeamsSubject.asObservable();

  triggerTeamsRefresh(): void {
    console.log('Auth service: Triggering teams refresh');
    this.refreshTeamsSubject.next();
  }

  // ================== TEAM LEAD METHODS ==================

  // Get lead profile information
  leadGetProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lead/profile`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Failed to fetch lead profile:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch lead profile'));
      })
    );
  }

  // Update lead profile information
  leadUpdateProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/lead/profile`, profileData, { headers: this.getAuthHeaders() }).pipe(
      tap(updatedProfile => {
        // Update current user in storage if the updated profile is for the current user
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === updatedProfile._id) {
          this.updateStoredUser(updatedProfile);
        }
      }),
      catchError(error => {
        console.error('Failed to update lead profile:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update lead profile'));
      })
    );
  }

  // Get projects assigned to the team lead
  leadGetProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lead/projects`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Failed to fetch lead projects:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch lead projects'));
      })
    );
  }

  // Get team information and members for the lead
  leadGetTeam(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lead/team`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Failed to fetch lead team:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch lead team'));
      })
    );
  }

  // Get dashboard statistics for the lead
  leadGetDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lead/dashboard`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Failed to fetch lead dashboard stats:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch lead dashboard stats'));
      })
    );
  }

  // ================== TEAM MEMBER MANAGEMENT ==================

  // Get available users that can be added to team (filtered by role)
  leadGetAvailableUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lead/team/available-users`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Failed to fetch available users:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch available users'));
      })
    );
  }

  // Add members to team lead's team
  leadAddTeamMembers(userIds: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lead/team/members`, { userIds }, { headers: this.getAuthHeaders() }).pipe(
      tap(response => {
        // Trigger refresh for teams data
        this.triggerTeamsRefresh();
      }),
      catchError(error => {
        console.error('Failed to add team members:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to add team members'));
      })
    );
  }

  // Remove members from team lead's team
  leadRemoveTeamMembers(userIds: string[]): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/lead/team/members`, { 
      body: { userIds },
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(response => {
        // Trigger refresh for teams data
        this.triggerTeamsRefresh();
      }),
      catchError(error => {
        console.error('Failed to remove team members:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to remove team members'));
      })
    );
  }

  // ================== TASK MANAGEMENT ==================

  // Create a new task
  leadCreateTask(taskData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lead/tasks`, taskData, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Failed to create task:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create task'));
      })
    );
  }

  // Get all tasks for lead's projects
  leadGetTasks(filters?: { projectId?: string; sprintId?: string; status?: string; assignee?: string }): Observable<any[]> {
    let url = `${this.apiUrl}/lead/tasks`;
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Failed to fetch lead tasks:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch lead tasks'));
      })
    );
  }

  // Update an existing task
  leadUpdateTask(taskId: string, taskData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/lead/tasks/${taskId}`, taskData, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Failed to update task:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update task'));
      })
    );
  }

  // Delete a task
  leadDeleteTask(taskId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/lead/tasks/${taskId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Failed to delete task:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete task'));
      })
    );
  }

  // ================== SPRINT MANAGEMENT ==================

  // Get sprints for lead's projects
  leadGetSprints(filters?: { projectId?: string; status?: string }): Observable<any[]> {
    let url = `${this.apiUrl}/lead/sprints`;
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Failed to fetch lead sprints:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch lead sprints'));
      })
    );
  }

  // Update sprint (limited fields for team lead)
  leadUpdateSprint(sprintId: string, sprintData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/lead/sprints/${sprintId}`, sprintData, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Failed to update sprint:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update sprint'));
      })
    );
  }

  // Helper method to update stored user data
  private updateStoredUser(updatedUser: any): void {
    if (!this.isBrowser()) return;
    
    const storage = localStorage.getItem('currentUser') ? localStorage : sessionStorage;
    storage.setItem('currentUser', JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);
  }
}