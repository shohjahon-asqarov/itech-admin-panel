export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'manager';
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course: string;
  status: 'new' | 'contacted' | 'enrolled' | 'cancelled';
  source: string;
  createdAt: string;
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
  id: number;
  title: string;
  description: string;
  duration: string;
  level: "Boshlang'ich" | "O'rta" | "Yuqori";
  price: string;
  students: number;
  rating: number;
  instructor: string;
  category: string;
  image: string;
  skills: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  course: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalRevenue: number;
  newLeads: number;
  activeStudents: number;
}