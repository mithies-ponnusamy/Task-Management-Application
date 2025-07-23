import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Project, Task, User } from '../../../model/user.model';
import { ModalData, ModalService } from '../../../core/services/modal/modal';
import { TaskService } from '../../../core/services/task/task';
import { ProjectService } from '../../../core/services/project/project';
import { UserService } from '../../../core/services/user/user';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task.html',
  styleUrls: ['./create-task.css']
})
export class CreateTask implements OnInit {
  showModal = false;
  newTask: Partial<Task> = {};
  projects: Project[] = [];
  teamMembers: User[] = [];
  
  constructor(
    private modalService: ModalService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser?.team) {
      this.projects = this.projectService.getProjectsByTeam(currentUser.team);
      this.teamMembers = this.userService.getTeamMembers(currentUser.team);
    }
    
    this.modalService.showCreateTask$.subscribe(show => {
      this.showModal = show;
      if (show) {
        this.resetForm();
      }
    });

    this.modalService.modalData$.subscribe((data: ModalData | null) => {
      if(this.showModal && data?.task?.projectId){
        this.newTask.projectId = data.task.projectId;
      }
    });
  }

  resetForm() {
    this.newTask = {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date(),
      assignee: '',
      projectId: this.newTask.projectId || (this.projects.length > 0 ? this.projects[0].id : ''),
      storyPoints: 3,
      status: 'todo',
      tags: [],
      attachments: [] // Initialize attachments
    };
  }
  
  createTask(form: NgForm): void {
    if (!form.valid) return;

    // Filter out empty attachments before saving
    this.newTask.attachments = this.newTask.attachments?.filter(att => att.name && att.url);

    const finalTask: Task = {
      ...this.newTask,
      id: `task-${Date.now()}`,
      status: 'todo',
    } as Task;

    this.taskService.addTask(finalTask);
    this.close();
  }

  addAttachmentLink(): void {
      if (!this.newTask.attachments) {
          this.newTask.attachments = [];
      }
      this.newTask.attachments.push({ name: '', url: '' });
  }

  removeAttachment(index: number): void {
      this.newTask.attachments?.splice(index, 1);
  }

  // This is a simulation. Real file uploads require a backend.
  handleFileInput(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
       if (!this.newTask.attachments) {
          this.newTask.attachments = [];
      }
      // Storing file name as a placeholder for a real URL
      this.newTask.attachments.push({ name: file.name, url: `file://${file.name}` });
    }
  }

  close(): void {
    this.modalService.closeAllModals();
  }
}