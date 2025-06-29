import { Lead, Instructor, Course, Testimonial, DashboardStats } from '../types';

export const mockStats: DashboardStats = {
  totalStudents: 1247,
  totalInstructors: 23,
  totalCourses: 15,
  totalRevenue: 45600000,
  newLeads: 48,
  activeStudents: 892,
};

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Akmal Toshmatov',
    phone: '+998901234567',
    email: 'akmal@example.com',
    course: 'Frontend Development',
    status: 'new',
    source: 'Instagram',
    createdAt: '2024-01-15T10:30:00Z',
    notes: 'React kursiga qiziqish bildirdi'
  },
  {
    id: '2',
    name: 'Malika Karimova',
    phone: '+998905678901',
    email: 'malika@example.com',
    course: 'Digital Marketing',
    status: 'contacted',
    source: 'Website',
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    name: 'Jasur Abdullayev',
    phone: '+998909876543',
    course: 'Mobile Development',
    status: 'enrolled',
    source: 'Referral',
    createdAt: '2024-01-13T09:15:00Z'
  }
];

export const mockInstructors: Instructor[] = [
  {
    id: 1,
    name: 'Olim Yusupov',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    bio: 'React va JavaScript bo\'yicha 5 yillik tajribaga ega dasturchi. Zamonaviy web texnologiyalar mutaxassisi.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    skills: ['React', 'JavaScript', 'TypeScript', 'Next.js', 'Node.js'],
    rating: 4.9,
    students: 156,
    courses: ['Frontend Development', 'React Advanced', 'JavaScript Fundamentals'],
    experience: '5+ yil',
    achievements: ['Google Developer Expert', 'React Conference Speaker'],
    social: {
      linkedin: 'https://linkedin.com/in/olimyusupov',
      twitter: 'https://twitter.com/olimyusupov',
      github: 'https://github.com/olimyusupov',
      website: 'https://olimyusupov.dev'
    }
  },
  {
    id: 2,
    name: 'Nilufar Rahimova',
    title: 'Digital Marketing Specialist',
    company: 'MarketPro',
    bio: 'Digital marketing va SMM bo\'yicha tajribali mutaxassis. Brendlarni rivojlantirishda katta tajribaga ega.',
    image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    skills: ['Digital Marketing', 'SMM', 'Google Ads', 'Facebook Ads', 'Analytics'],
    rating: 4.8,
    students: 89,
    courses: ['Digital Marketing', 'SMM Mastery', 'Google Ads'],
    experience: '3+ yil',
    achievements: ['Google Ads Certified', 'Facebook Blueprint Certified'],
    social: {
      linkedin: 'https://linkedin.com/in/nilufarrahimova',
      twitter: 'https://twitter.com/nilufarrahimova',
      github: 'https://github.com/nilufarrahimova'
    }
  },
  {
    id: 3,
    name: 'Botir Saidov',
    title: 'Mobile App Developer',
    company: 'AppStudio',
    bio: 'Flutter va React Native bo\'yicha mutaxassis. Cross-platform mobile ilovalar yaratishda tajribali.',
    image: 'https://images.pexels.com/photos/3823495/pexels-photo-3823495.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    skills: ['Flutter', 'Dart', 'React Native', 'Firebase', 'Mobile UI/UX'],
    rating: 4.7,
    students: 134,
    courses: ['Mobile Development', 'Flutter Advanced', 'React Native'],
    experience: '4+ yil',
    achievements: ['Flutter Community Leader', 'Mobile App Awards Winner'],
    social: {
      linkedin: 'https://linkedin.com/in/botirsaidov',
      twitter: 'https://twitter.com/botirsaidov',
      github: 'https://github.com/botirsaidov',
      youtube: 'https://youtube.com/c/botirsaidov'
    }
  }
];

export const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Frontend Development',
    description: 'React, TypeScript va zamonaviy vositalar bilan to\'liq web dasturlash kursi',
    duration: '4 oy',
    level: "O'rta",
    price: '2,500,000 so\'m',
    students: 25,
    rating: 4.9,
    instructor: 'Olim Yusupov',
    category: 'Web Development',
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1',
    skills: ['React', 'TypeScript', 'HTML/CSS', 'JavaScript', 'Git']
  },
  {
    id: 2,
    title: 'Digital Marketing',
    description: 'Zamonaviy digital marketing strategiyalari va vositalarini o\'rganing',
    duration: '3 oy',
    level: "Boshlang'ich",
    price: '1,800,000 so\'m',
    students: 18,
    rating: 4.8,
    instructor: 'Nilufar Rahimova',
    category: 'Marketing',
    image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1',
    skills: ['SMM', 'Google Ads', 'Analytics', 'Content Marketing', 'SEO']
  },
  {
    id: 3,
    title: 'Mobile Development',
    description: 'Flutter va Dart bilan mobil ilovalar yarating',
    duration: '5 oy',
    level: "O'rta",
    price: '2,200,000 so\'m',
    students: 20,
    rating: 4.7,
    instructor: 'Botir Saidov',
    category: 'Mobile Development',
    image: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1',
    skills: ['Flutter', 'Dart', 'Firebase', 'Mobile UI/UX', 'API Integration']
  },
  {
    id: 4,
    title: 'Backend Development',
    description: 'Node.js va Express bilan server-side dasturlash',
    duration: '4 oy',
    level: "Yuqori",
    price: '2,800,000 so\'m',
    students: 15,
    rating: 4.6,
    instructor: 'Olim Yusupov',
    category: 'Web Development',
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1',
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST API']
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sardor Alimov',
    role: 'Frontend Developer',
    image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    content: 'Ajoyib kurs! Juda ko\'p narsalarni o\'rgandim va hozir React dasturchi sifatida ishlayman.',
    rating: 5,
    course: 'Frontend Development'
  },
  {
    id: 2,
    name: 'Dilfuza Nazarova',
    role: 'Digital Marketer',
    image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    content: 'Zo\'r o\'qituvchi va amaliy misollar. Juda tavsiya qilaman!',
    rating: 4,
    course: 'Digital Marketing'
  },
  {
    id: 3,
    name: 'Nodir Karimov',
    role: 'Mobile Developer',
    image: 'https://images.pexels.com/photos/3823495/pexels-photo-3823495.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    content: 'O\'zbekistondagi eng yaxshi mobil dasturlash kursi. Endi ilovalar yarata olaman!',
    rating: 5,
    course: 'Mobile Development'
  },
  {
    id: 4,
    name: 'Gulnora Toshmatova',
    role: 'Marketing Manager',
    image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    content: 'Kurs davomida juda ko\'p amaliy bilimlar oldim. Ish joyimda darhol qo\'llay boshladim.',
    rating: 5,
    course: 'Digital Marketing'
  }
];