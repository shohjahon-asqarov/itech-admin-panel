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

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  image?: string;
  language: string;
  isActive: boolean;
  title?: string;
  company?: string;
  skills?: string;
  experience?: string;
  createdAt: string;
  updatedAt: string;
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
