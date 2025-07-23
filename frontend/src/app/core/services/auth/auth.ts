import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { AuthResponse, Team, User, UserRole, Project, Sprint } from '../../../model/user.model';

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
    return this.http.get<any[]>(`${this.apiUrl}/admin/teams`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      map(teams => teams.map(team => this.mapApiTeamToTeam(team))),
      catchError(error => {
        console.error('Failed to fetch teams:', error);
        return throwError(() => new Error('Failed to fetch teams'));
      })
    );
  }

  adminGetTeamById(id: string): Observable<Team> {
    return this.http.get<any>(`${this.apiUrl}/admin/teams/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      map(team => this.mapApiTeamToTeam(team)),
      catchError(error => {
        console.error('Failed to fetch team:', error);
        return throwError(() => new Error('Failed to fetch team'));
      })
    );
  }

  adminCreateTeam(teamData: Partial<Team>): Observable<Team> {
    return this.http.post<any>(`${this.apiUrl}/admin/teams`, teamData, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      map(team => this.mapApiTeamToTeam(team)),
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
      _id: apiTeam._id,
      name: apiTeam.name,
      department: apiTeam.department,
      lead: apiTeam.lead?._id || apiTeam.lead,
      members: apiTeam.membersCount || (apiTeam.members ? apiTeam.members.length : 0),
      projects: apiTeam.projectsCount || (apiTeam.projects ? apiTeam.projects.length : 0),
      completionRate: apiTeam.completionRate || 0,
      description: apiTeam.description || '',
      parentTeam: apiTeam.parentTeam?._id || apiTeam.parentTeam,
      subTeams: apiTeam.subTeams?.map((sub: any) => sub._id || sub) || [],
      leadDetails: apiTeam.lead,
      memberDetails: apiTeam.members || [],
      projectDetails: apiTeam.projects || [],
      createdAt: apiTeam.createdAt,
      updatedAt: apiTeam.updatedAt,
      memberCount: apiTeam.membersCount || (apiTeam.members ? apiTeam.members.length : 0),
      membersList: apiTeam.members?.map((member: any) => member._id || member) || [],
      projectCount: apiTeam.projectsCount || (apiTeam.projects ? apiTeam.projects.length : 0),
      projectList: apiTeam.projects?.map((project: any) => project._id || project) || []
    };
  }

  // ===== PROJECT MANAGEMENT METHODS =====

  // Get all projects
  adminGetAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/admin/projects`, { headers: this.getAuthHeaders() }).pipe(
      map(projects => projects.map(project => this.mapApiProjectToProject(project))),
      catchError(err => {
        console.error('AdminGetAllProjects failed:', err);
        return throwError(() => new Error('Failed to fetch projects.'));
      })
    );
  }

  // Get project by ID
  adminGetProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/admin/projects/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(project => this.mapApiProjectToProject(project)),
      catchError(err => {
        console.error('AdminGetProjectById failed:', err);
        return throwError(() => new Error('Failed to fetch project.'));
      })
    );
  }

  // Create new project
  adminCreateProject(projectData: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/admin/projects`, projectData, { headers: this.getAuthHeaders() }).pipe(
      map(project => this.mapApiProjectToProject(project)),
      catchError(err => {
        console.error('Failed to create project:', err);
        const errorMessage = err.error?.message || err.message || 'Unknown error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Update project
  adminUpdateProject(id: string, projectData: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/admin/projects/${id}`, projectData, { headers: this.getAuthHeaders() }).pipe(
      map(project => this.mapApiProjectToProject(project)),
      catchError(err => {
        console.error('Failed to update project:', err);
        const errorMessage = err.error?.message || err.message || 'Unknown error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Delete project
  adminDeleteProject(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/admin/projects/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Failed to delete project:', err);
        const errorMessage = err.error?.message || err.message || 'Unknown error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Map API project data to frontend Project interface
  public mapApiProjectToProject(apiProject: any): Project {
    return {
      id: apiProject._id || apiProject.id,
      name: apiProject.name,
      description: apiProject.description || '',
      team: apiProject.team?._id || apiProject.team || '',
      lead: apiProject.lead?._id || apiProject.lead || '',
      startDate: apiProject.startDate,
      deadline: apiProject.deadline,
      status: apiProject.status || 'not-started',
      progress: apiProject.progress || 0,
      priority: apiProject.priority || 'medium',
      teamMembers: apiProject.teamMembers?.map((member: any) => member._id || member) || [],
      tasks: apiProject.tasks || [],
      createdAt: apiProject.createdAt,
      updatedAt: apiProject.updatedAt,
      endDate: apiProject.endDate
    };
  }

  // ===== SPRINT MANAGEMENT METHODS =====

  // Get all sprints
  adminGetAllSprints(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.apiUrl}/admin/sprints`, { headers: this.getAuthHeaders() }).pipe(
      map(sprints => sprints.map(sprint => this.mapApiSprintToSprint(sprint))),
      catchError(err => {
        console.error('AdminGetAllSprints failed:', err);
        return throwError(() => new Error('Failed to fetch sprints.'));
      })
    );
  }

  // Get sprint by ID
  adminGetSprintById(id: string): Observable<Sprint> {
    return this.http.get<Sprint>(`${this.apiUrl}/admin/sprints/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(sprint => this.mapApiSprintToSprint(sprint)),
      catchError(err => {
        console.error('AdminGetSprintById failed:', err);
        return throwError(() => new Error('Failed to fetch sprint.'));
      })
    );
  }

  // Create new sprint
  adminCreateSprint(sprintData: Partial<Sprint>): Observable<Sprint> {
    const payload = { ...sprintData };
    delete payload.id; // Remove frontend 'id' as backend uses '_id'
    delete payload._id; // Ensure _id is not sent

    return this.http.post<Sprint>(`${this.apiUrl}/admin/sprints`, payload, { headers: this.getAuthHeaders() }).pipe(
      map(sprint => this.mapApiSprintToSprint(sprint)),
      catchError(err => {
        console.error('AdminCreateSprint failed:', err);
        const errorMessage = err.error?.message || err.message || 'Unknown error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Update sprint
  adminUpdateSprint(id: string, sprintData: Partial<Sprint>): Observable<Sprint> {
    const payload = { ...sprintData };
    delete payload.id; // Remove frontend 'id' from payload
    delete payload._id; // Remove _id from payload

    return this.http.put<Sprint>(`${this.apiUrl}/admin/sprints/${id}`, payload, { headers: this.getAuthHeaders() }).pipe(
      map(sprint => this.mapApiSprintToSprint(sprint)),
      catchError(err => {
        console.error('AdminUpdateSprint failed:', err);
        const errorMessage = err.error?.message || err.message || 'Unknown error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Delete sprint
  adminDeleteSprint(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/admin/sprints/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Failed to delete sprint:', err);
        const errorMessage = err.error?.message || err.message || 'Unknown error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Get sprints by project
  adminGetSprintsByProject(projectId: string): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.apiUrl}/admin/sprints/project/${projectId}`, { headers: this.getAuthHeaders() }).pipe(
      map(sprints => sprints.map(sprint => this.mapApiSprintToSprint(sprint))),
      catchError(err => {
        console.error('AdminGetSprintsByProject failed:', err);
        return throwError(() => new Error('Failed to fetch sprints for project.'));
      })
    );
  }

  // Map API sprint data to frontend Sprint interface
  public mapApiSprintToSprint(apiSprint: any): Sprint {
    return {
      id: apiSprint._id || apiSprint.id,
      _id: apiSprint._id,
      name: apiSprint.name,
      description: apiSprint.description || '',
      project: apiSprint.project?._id || apiSprint.project || '',
      status: apiSprint.status || 'upcoming',
      startDate: apiSprint.startDate,
      endDate: apiSprint.endDate,
      goal: apiSprint.goal || '',
      tasks: apiSprint.tasks || [],
      createdBy: apiSprint.createdBy?._id || apiSprint.createdBy,
      createdAt: apiSprint.createdAt,
      updatedAt: apiSprint.updatedAt,
      totalTasks: apiSprint.totalTasks || apiSprint.tasks?.length || 0,
      completedTasks: apiSprint.completedTasks || 0,
      progress: apiSprint.progress || 0
    };
  }
}