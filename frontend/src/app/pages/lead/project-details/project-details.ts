import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalData, ModalService } from '../../../core/services/modal/modal';
import { UserService } from '../../../core/services/user/user';
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

  constructor(
    private modalService: ModalService,
    private userService: UserService
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
  }

  loadProjectMembers(): void {
    if (this.project && this.project.team) {
      this.projectTeamMembers = this.userService.getTeamMembers(this.project.team);
    } else {
      this.projectTeamMembers = [];
    }
  }

  close(): void {
    this.modalService.closeAllModals();
  }
}