import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Task, Project } from '../../../model/user.model';

export interface ModalData {
  task?: Task;
  project?: Project;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Modal visibility subjects
  private showCreateTaskModal = new BehaviorSubject<boolean>(false);
  private showManageTeamModal = new BehaviorSubject<boolean>(false);
  private showProjectDetailsModal = new BehaviorSubject<boolean>(false);
  private showManageSprintsModal = new BehaviorSubject<boolean>(false);
  
  // Data and notification subjects
  private modalData = new BehaviorSubject<ModalData | null>(null);
  private sprintsChanged = new Subject<void>();

  // Public observables
  showCreateTask$ = this.showCreateTaskModal.asObservable();
  showManageTeam$ = this.showManageTeamModal.asObservable();
  showProjectDetails$ = this.showProjectDetailsModal.asObservable();
  showManageSprints$ = this.showManageSprintsModal.asObservable();
  modalData$ = this.modalData.asObservable();
  sprintsChanged$ = this.sprintsChanged.asObservable();

  constructor() { }

  // --- Open Methods ---
  openCreateTaskModal(projectId?: string) { this.closeAllModals(); this.modalData.next({ task: { projectId: projectId || '' } as Task }); this.showCreateTaskModal.next(true); }
  openManageTeamModal() { this.closeAllModals(); this.showManageTeamModal.next(true); }
  openProjectDetailsModal(project: Project) { this.closeAllModals(); this.modalData.next({ project }); this.showProjectDetailsModal.next(true); }
  openManageSprintsModal() { this.closeAllModals(); this.showManageSprintsModal.next(true); }

  // --- Notification Methods ---
  notifySprintsChanged() {
    this.sprintsChanged.next();
  }

  // --- Close Method ---
  closeAllModals() {
    this.showCreateTaskModal.next(false);
    this.showManageTeamModal.next(false);
    this.showProjectDetailsModal.next(false);
    this.showManageSprintsModal.next(false);
    this.modalData.next(null);
  }
}