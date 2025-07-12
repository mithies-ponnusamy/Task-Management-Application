// session-storage.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SessionStorage {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private get storage(): Storage | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage;
    }
    return null;
  }

  static setItem(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, value);
    }
  }

  static getItem(key: string): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(key);
    }
    return null;
  }

  static removeItem(key: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(key);
    }
  }

  static clear(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
    }
  }
}