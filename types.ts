export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  ADMIN = 'ADMIN'
}

export interface SkillMetrics {
  leadership: number;
  creativity: number;
  teamwork: number;
  technical: number;
  communication: number;
}

export interface User {
  id: string;
  name: string;
  email: string; // Added email field
  role: UserRole;
  avatar: string;
  totalCredits: number;
  skills: SkillMetrics;
  rank: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  category: 'Workshop' | 'Seminar' | 'Hackathon' | 'Club Activity';
  credits: number;
  status: 'Upcoming' | 'Completed' | 'Verified';
  image: string;
  description: string;
  skills: SkillMetrics;
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  image: string;
  description: string;
  category: 'Merch' | 'Academic' | 'Voucher';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'reward' | 'verification';
  isRead: boolean;
  date: string;
}