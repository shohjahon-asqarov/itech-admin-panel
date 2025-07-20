// API Services
export { apiService } from "./api";
export type { ApiResponse, PaginatedResponse } from "./api";

// Authentication Service
export { AuthService } from "./authService";
export type {
  LoginCredentials,
  LoginResponse,
  RegisterData,
} from "./authService";

// Course Service
export { CourseService } from "./courseService";
export type {
  CreateCourseData,
  UpdateCourseData,
  CourseFilters,
} from "./courseService";

// Teacher Service
export { TeacherService } from "./teacherService";
export type {
  CreateTeacherData,
  UpdateTeacherData,
  TeacherFilters,
} from "./teacherService";

// Lead Service
export { LeadService } from "./leadService";
export type {
  CreateLeadData,
  UpdateLeadData,
  LeadFilters,
} from "./leadService";

// Testimonial Service
export { TestimonialService } from "./testimonialService";
export type {
  CreateTestimonialData,
  UpdateTestimonialData,
  TestimonialFilters,
} from "./testimonialService";
