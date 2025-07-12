// profile.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user/user';
import { User } from '../../../model/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
  currentUser: User | null = null;

  constructor(private userService: UserService) {
    this.currentUser = this.userService.getUsers().find(user => user.id === '2') ?? null;
  }
}