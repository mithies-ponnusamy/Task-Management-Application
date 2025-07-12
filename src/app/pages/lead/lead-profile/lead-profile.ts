import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user/user';
import { User } from '../../../model/user.model';

@Component({
  selector: 'app-lead-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lead-profile.html',
  styleUrls: ['./lead-profile.css']
})
export class LeadProfile {
  currentUser: User | null = null;

  constructor(private userService: UserService) {
    this.currentUser = this.userService.getUsers().find(u => u.role === 'team-lead') ?? null;
  }
}