// core/services/local-storage/local-storage.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  // GET value from local storage
  get<T>(key: string): T | null {
    if (typeof localStorage === 'undefined') return null;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  }

  // SET value to local storage
  set<T>(key: string, value: T): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // REMOVE a key
  remove(key: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  }

  // CLEAR all local storage
  clear(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.clear();
  }

  // Specific helpers for application models
  getUsers<T>(): T | null {
    return this.get<T>('users');
  }

  saveUsers<T>(users: T): void {
    this.set<T>('users', users);
  }

  getTeams<T>(): T | null {
    return this.get<T>('teams');
  }

  saveTeams<T>(teams: T): void {
    this.set<T>('teams', teams);
  }

  getProjects<T>(): T | null {
    return this.get<T>('projects');
  }

  saveProjects<T>(projects: T): void {
    this.set<T>('projects', projects);
  }

  getSprints<T>(): T | null {
    return this.get<T>('sprints');
  }

  saveSprints<T>(sprints: T): void {
    this.set<T>('sprints', sprints);
  }

  getTasks<T>(): T | null {
    return this.get<T>('tasks');
  }

  saveTasks<T>(tasks: T): void {
    this.set<T>('tasks', tasks);
  }
}