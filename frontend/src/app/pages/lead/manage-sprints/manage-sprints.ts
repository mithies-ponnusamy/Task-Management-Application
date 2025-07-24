import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Project, Sprint } from '../../../model/user.model';
import { ModalService } from '../../../core/services/modal/modal';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage';
import { TaskService } from '../../../core/services/task/task';
import { ProjectService } from '../../../core/services/project/project';
import { UserService } from '../../../core/services/user/user';

@Component({
  selector: 'app-manage-sprints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-sprints.html',
  styleUrls: ['./manage-sprints.css'],
})
export class ManageSprints implements OnInit {
  showModal = false;
  projects: Project[] = [];
  allSprints: Sprint[] = [];

  editingSprint: Sprint | null = null;
  newSprint: Partial<Sprint> = {};

  constructor(
    private modalService: ModalService,
    private localStorage: LocalStorageService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.modalService.showManageSprints$.subscribe((show) => {
      this.showModal = show;
      if (show) {
        this.loadInitialData();
      }
    });
  }

  loadInitialData(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser?.team) {
      this.projects = this.projectService.getProjectsByTeam(currentUser.team);
    }
    this.allSprints = this.localStorage.getSprints<Sprint[]>() || [];
    this.resetNewSprintForm();
  }
  
  resetNewSprintForm(): void {
    this.newSprint = {
        name: '',
        startDate: new Date(),
        endDate: new Date(),
        projectId: this.projects.length > 0 ? this.projects[0].id : '',
    };
  }

  createSprint(form: NgForm): void {
    if (!form.valid) return;

    const sprintToAdd: Sprint = {
      id: `sprint-${Date.now()}`,
      name: this.newSprint.name!,
      startDate: this.newSprint.startDate!,
      endDate: this.newSprint.endDate!,
      projectId: this.newSprint.projectId!,
      status: 'not-started',
    };

    this.allSprints.push(sprintToAdd);
    this.localStorage.saveSprints(this.allSprints);
    this.modalService.notifySprintsChanged();
    this.resetNewSprintForm();
    form.resetForm(this.newSprint);
  }

  updateSprint(form: NgForm): void {
    if (!form.valid || !this.editingSprint) return;

    const index = this.allSprints.findIndex((s) => s.id === this.editingSprint!.id);
    if (index > -1) {
      this.allSprints[index] = { ...this.editingSprint };
      this.localStorage.saveSprints(this.allSprints);
      this.modalService.notifySprintsChanged();
      this.editingSprint = null;
    }
  }

  deleteSprint(sprintId: string): void {
    if (confirm('Are you sure? This will move all tasks in this sprint to the product backlog.')) {
        // Unassign tasks from the sprint being deleted
        const tasks = this.taskService.getTasks();
        tasks.forEach((task: any) => {
            if (task.sprintId === sprintId) {
                task.sprintId = undefined;
                this.taskService.updateTask(task); // Update without broad notification
            }
        });
        this.taskService.tasksUpdated$.next(); // Notify once after all updates

        // Remove the sprint
        this.allSprints = this.allSprints.filter(s => s.id !== sprintId);
        this.localStorage.saveSprints(this.allSprints);
        this.modalService.notifySprintsChanged();
    }
  }
  
  openEditSprintModal(sprint: Sprint): void {
    this.editingSprint = { ...sprint };
  }
  
  cancelEdit(): void {
      this.editingSprint = null;
  }

  close(): void {
    this.modalService.closeAllModals();
  }
}