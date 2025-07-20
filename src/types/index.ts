export interface User {
  id: string;
  name: string;
  phone: string;
  role: "admin" | "manager";
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course?: { id: string; title: string } | null;
  status: "NEW" | "CONTACTED" | "ENROLLED" | "REJECTED";
  source?: string;
  createdAt: string;
  message?: string;
  notes?: string;
}

export interface Instructor {
  id: number;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string;
  skills: string[];
  rating: number;
  students: number;
  courses: string[];
  experience: string;
  achievements?: string[];
  social: {
    linkedin: string;
    twitter: string;
    github: string;
    website?: string;
    youtube?: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price: number;
  students?: number;
  category?: string;
  image?: string;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  image?: string;
  course?: string | { id: string; title: string };
  createdAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalRevenue: number;
  newLeads: number;
  activeStudents: number;
}
