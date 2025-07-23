// team.ts
import { Injectable } from '@angular/core';
import { Team } from '../../../model/user.model';
import { LocalStorageService } from '../local-storage/local-storage';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  constructor(private localStorage: LocalStorageService) {}

  getTeams(): Team[] {
    const teams = this.localStorage.getTeams<Team[]>() || [];
    const projects = this.localStorage.getProjects<any[]>() || [];
    
    // Map projects to teams
    return teams.map(team => {
      const teamProjects = projects.filter(project => project.team === team.name);
      return {
        ...team,
        projects: teamProjects.length,
        projectList: teamProjects // Add project list to team
      };
    });
  }

  addTeam(team: Team): void {
    const teams = this.localStorage.getTeams<Team[]>() || [];
    teams.push(team);
    this.localStorage.saveTeams(teams);
  }

  updateTeam(team: Team): void {
    const teams = this.localStorage.getTeams<Team[]>() || [];
    const index = teams.findIndex(t => t.id === team.id);
    if (index !== -1) {
      teams[index] = { ...team };
      this.localStorage.saveTeams(teams);
    }
  }

  deleteTeam(teamId: string): void {
    let teams = this.localStorage.getTeams<Team[]>() || [];
    teams = teams.filter(team => team.id !== teamId);
    this.localStorage.saveTeams(teams);
  }

  getTeamProjects(teamName: string): any[] {
    const projects = this.localStorage.getProjects<any[]>() || [];
    return projects.filter(project => project.team === teamName);
  }
}