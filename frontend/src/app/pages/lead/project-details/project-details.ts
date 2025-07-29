import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalData, ModalService } from '../../../core/services/modal/modal';
import { UserService } from '../../../core/services/user/user';
import { Auth } from '../../../core/services/auth/auth';
import { Project, User } from '../../../model/user.model';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.css']
})
export class ProjectDetails implements OnInit {
  showModal = false;
  project: Project| null = null;
  projectTeamMembers: User[] = [];
  teams: any[] = [];
  users: any[] = [];

  constructor(
    private modalService: ModalService,
    private userService: UserService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.modalService.showProjectDetails$.subscribe(show => {
      this.showModal = show;
    });

    this.modalService.modalData$.subscribe((data: ModalData | null) => {
      if (data && data.project) {
        this.project = data.project;
        this.loadProjectMembers();
      } else {
        this.project = null;
      }
    });

    // Load teams and users data for team member resolution
    this.loadTeamsAndUsers();
  }

  loadTeamsAndUsers(): void {
    // Load lead's team data
    this.authService.leadGetTeam().subscribe({
      next: (teamData) => {
        console.log('Team data loaded for lead:', teamData);
        
        // Extract team info and members from the response
        if (teamData.team) {
          // Store team data with members information
          const teamWithMembers = {
            ...teamData.team,
            memberDetails: teamData.members || [], // Store the populated member details
            members: teamData.members ? teamData.members.map((m: any) => m._id || m.id) : [] // Store member IDs
          };
          this.teams = [teamWithMembers];
        }
        
        // Also store members as users for fallback
        if (teamData.members) {
          this.users = teamData.members;
        }
        
        console.log('Processed team data:', this.teams);
        console.log('Team members:', this.users);
        
        // Reload project members now that we have team data
        if (this.project) {
          this.loadProjectMembers();
        }
      },
      error: (error) => {
        console.error('Error loading lead team:', error);
        
        // Fallback: try to get team data via admin API (if lead has admin permissions)
        this.authService.adminGetAllTeams().subscribe({
          next: (allTeams) => {
            this.teams = allTeams;
            console.log('Teams loaded via admin API fallback:', allTeams);
            
            // Also try to load all users for member resolution
            this.authService.adminGetAllUsers().subscribe({
              next: (allUsers) => {
                this.users = allUsers;
                console.log('Users loaded via admin API fallback:', allUsers);
                
                // Reload project members with fallback data
                if (this.project) {
                  this.loadProjectMembers();
                }
              },
              error: (userError) => {
                console.error('Error loading users via admin API:', userError);
              }
            });
          },
          error: (adminError) => {
            console.error('Error loading teams via admin API:', adminError);
          }
        });
      }
    });
  }

  loadProjectMembers(): void {
    console.log('Loading team members for project:', this.project);
    
    if (!this.project || !this.project.team) {
      console.log('No project or team ID provided, clearing team members');
      this.projectTeamMembers = [];
      return;
    }

    const teamId = this.project.team;
    console.log('Loading team members for team ID:', teamId);
    
    // Find the team by ID and get its members
    const team = this.teams.find(t => t.id === teamId || t._id === teamId);
    console.log('Found team:', team);
    
    if (team && team.memberDetails && Array.isArray(team.memberDetails) && team.memberDetails.length > 0) {
      console.log('Using cached team member details:', team.memberDetails);
      this.projectTeamMembers = team.memberDetails;
    } else if (team && team.members && Array.isArray(team.members)) {
      console.log('Processing team members from basic data:', team.members);
      // If we have member IDs but not full details, try to resolve them from users array
      this.projectTeamMembers = team.members.map((memberId: any) => {
        const member = this.users.find(u => u.id === memberId || u._id === memberId);
        return member ? {
          id: member.id || member._id,
          name: member.name,
          email: member.email,
          role: member.role || 'Member',
          profileImg: member.profileImg
        } : {
          id: memberId,
          name: 'Unknown',
          email: '',
          role: 'Member',
          profileImg: null
        };
      });
      console.log('Resolved team members:', this.projectTeamMembers);
    } else {
      console.log('No team member data found locally, fetching from backend for team ID:', teamId);
      // If team details not available locally, fetch from backend
      this.authService.adminGetTeamById(teamId).subscribe({
        next: (teamData: any) => {
          console.log('Team data loaded from backend:', teamData);
          if (teamData.members && Array.isArray(teamData.members)) {
            this.projectTeamMembers = teamData.members.map((member: any) => ({
              id: member._id || member.id,
              name: member.name || 'Unknown',
              email: member.email || '',
              role: member.role || 'Member',
              profileImg: member.profileImg || null
            }));
          } else {
            this.projectTeamMembers = [];
          }
          console.log('Team members set from backend:', this.projectTeamMembers);
        },
        error: (error: any) => {
          console.error('Error loading team data from backend:', error);
          this.projectTeamMembers = [];
        }
      });
    }
  }

  close(): void {
    this.modalService.closeAllModals();
  }
}