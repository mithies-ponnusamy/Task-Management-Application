// user.model.ts
export interface User {
  _id?: string;
  id: string;
  numericalId?: number;
  email: string;
  role: UserRole;
  name: string;
  username?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  department?: string;
  team?: string | null;
  status: string;
  employeeType?: string;
  location?: string;
  joinDate?: string;
  lastActive?: string;
  address?: string;
  about?: string;
  profileImg?: string;
  password: string; // Changed from optional to required
  notifications?: Notification[];
  performance?: {
    taskCompletion: number;
    onTimeDelivery: number;
    qualityRating: number;
    projects: string[];
  };
  projects?: {
    length: number;
  };
  completionRate?: number;
  selected?: boolean;
}

export enum UserRole {
  ADMIN = 'admin',
  LEAD = 'team-lead',
  USER = 'user'
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  _id: string;
  numericalId: number;
  user: User;
  username: string;
  email: string;
  role: UserRole;
  name: string; // Optional if not always returned
  token: string;
  status: string; // Optional if not always returned
  profileImg?: string; // Optional if not always returned
  phone?: string; 
  gender?: string;
  dob?: string;
  department?: string;
  team?: string | null; // Optional if not always returned
  employeeType?: string;
  location?: string;
  joinDate?: string;
  lastActive?: string;
  address?: string;
  about?: string;
  notifications?: Notification[];
  performance?: {
    taskCompletion: number;
    onTimeDelivery: number;
    qualityRating: number;
    projects: string[];
  };
  completionRate?: number;
}

export interface Team {
  _id?: string; // Changed from id to _id to match the AuthResponse interface
  id: string;
  name: string;
  department: string;
  lead?: string;
  leadName?: string; // Added for displaying lead name in UI
  members?: number | User[];
  projects?: number | Project[];
  completionRate: number;
  description?: string;
  parentTeam?: string | Team | null;
  subTeams?: string[] | Team[];
  createdAt?: Date;
  updatedAt?: Date;
  memberCount?: number;
  membersList?: string[];
  projectCount?: number;
  projectList?: string[];
  memberDetails?: User[];
  projectDetails?: Project[];
  leadDetails?: User | null;
  performanceMetrics?: {
    taskCompletion: number;
    onTimeDelivery: number;
    qualityRating: number;
  };
}

export interface TeamDetails extends Team {
  hierarchy?: TeamHierarchy[];
  leadDetails?: User | null;
  memberDetails?: User[];
  projectDetails?: Project[];
}

export interface TeamHierarchy {
  id: string;
  name: string;
  level: number;
  members: number;
  projects: number;
}

export interface Project {
  id: string;
  name: string;
  team: string;
  lead: string;
  startDate: string | Date;
  deadline: string | Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  teamMembers?: string[];
  tasks?: Task[];
  createdAt?: Date;
  updatedAt?: Date;
  endDate?: string | Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId?: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  startTime?: string;
  endTime?: string;
  dueDate: Date;
  completionDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  project?: string;
  projectId: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags: string[]; 
  progress?: number;
  storyPoints?: number;
  sprintId?: string;
  attachments?: { name: string; url: string }[]; // New field for attachments
}


export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'project' | 'team' | 'task' | 'general';
  projectId?: string;
  memberId?: string;
  taskId?: string;
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  startDate: Date;
  endDate: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  tasks?: Task[];
  createdAt?: Date;
  updatedAt?: Date;
}