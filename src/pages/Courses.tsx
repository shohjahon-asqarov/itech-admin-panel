import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Plus, Users, Clock, DollarSign, Star, BookOpen, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { Course } from '@/types';
import { CourseService } from '@/services';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate, formatCurrency } from '@/utils';

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // location qo'shildi
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const queryClient = useQueryClient();

  // Fetch courses (GET)
  const {
    data: courses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => await CourseService.getAll(),
  });

  // location.state orqali formdan qaytilganini tekshirish va refetch qilish
  //   React.useEffect(() => {
  //     if (location.state && (location.state.from === 'form' || location.state.updated)) {
  //       refetch();
  //       // state ni tozalash uchun replace
  //       navigate(location.pathname, { replace: true });
  //     }
  //   }, [location, navigate, refetch]);

  // Delete course (DELETE)
  const {
    mutate: deleteCourse,
    isLoading: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: (id: string) => CourseService.delete(id),
    onSuccess: () => {
      toast.success("Kurs muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ['courses'] }); // Boshqa pagelardagi kabi
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Kursni o‘chirishda xatolik!');
    },
  });


  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));
  const levels = Array.from(new Set(courses.map(c => c.level).filter(Boolean)));

  const stats = {
    total: courses.length,
    active: courses.filter(c => c.isActive).length,
    inactive: courses.filter(c => !c.isActive).length,
  };

  const handleDelete = (courseId: string) => {
    if (confirm('Kursni o\'chirishni xohlaysizmi?')) {
      deleteCourse(courseId);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLevelText = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'Boshlang\'ich';
      case 'intermediate': return 'O\'rta';
      case 'advanced': return 'Yuqori';
      default: return level;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Kurslar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-600">Xatolik: {(error as Error)?.message || 'Kurslarni yuklashda xatolik!'}</p>
          <Button onClick={() => refetch()} className="mt-4">Qayta yuklash</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 p-4 lg:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Kurslar
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">Kurslarni boshqarish va kuzatish</p>
        </div>
        <Button
          onClick={() => navigate('/courses/new')}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg rounded-xl w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yangi Kurs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Jami Kurslar</p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="p-2 lg:p-3 bg-blue-500 rounded-xl lg:rounded-2xl">
                <BookOpen className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Faol</p>
                <p className="text-2xl lg:text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="p-2 lg:p-3 bg-green-500 rounded-xl lg:rounded-2xl">
                <Star className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Faol emas</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <div className="p-2 lg:p-3 bg-gray-500 rounded-xl lg:rounded-2xl">
                <BookOpen className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Kurs nomi yoki tavsif bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[150px] rounded-xl border-gray-200">
                  <SelectValue placeholder="Kategoriya" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha kategoriyalar</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-[150px] rounded-xl border-gray-200">
                  <SelectValue placeholder="Daraja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha darajalar</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{getLevelText(level)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl p-0"
          >
            {/* Image & Badges */}
            <div className="relative h-40 w-full overflow-hidden rounded-t-3xl">
              <img
                src={course.image || 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80'}
                alt={course.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              {/* Category badge */}
              {course.category && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                  {course.category}
                </span>
              )}
              {/* Status badge */}
              <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${course.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                {course.isActive ? 'Faol' : 'Faol emas'}
              </span>
            </div>

            {/* Card Content */}
            <div className="flex flex-col justify-between flex-1 p-5 bg-white/90 backdrop-blur-md rounded-b-3xl min-h-[220px]">
              {/* Title & Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 truncate mb-1 group-hover:text-indigo-700 transition-colors">{course.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{course.description || 'Tavsif yo\'q'}</p>
              </div>

              {/* Info Row */}
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-gray-600">
                    <DollarSign size={15} className="text-blue-400" />
                    <span>Narxi</span>
                  </span>
                  <span className="font-semibold text-gray-900">{formatCurrency(course.price)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Clock size={15} className="text-indigo-400" />
                    <span>Davomiyligi</span>
                  </span>
                  <span className="font-semibold text-gray-900">{course.duration || 'Belgilanmagan'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Users size={15} className="text-green-400" />
                    <span>Talabalar</span>
                  </span>
                  <span className="font-semibold text-gray-900">{course.students || 0}</span>
                </div>
              </div>

              {/* Level & Date */}
              <div className="flex items-center justify-between mb-4">
                <Badge className={`rounded-full px-3 py-1 text-xs font-semibold shadow ${getLevelColor(course.level)}`}>{getLevelText(course.level)}</Badge>
                <span className="text-xs text-gray-400">{formatDate(course.createdAt)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedCourse(course)}
                      className="hover:bg-blue-50 hover:text-blue-600 rounded-xl h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Kurs ma'lumotlari</DialogTitle>
                      <DialogDescription>
                        {selectedCourse?.title} haqida batafsil ma'lumot
                      </DialogDescription>
                    </DialogHeader>
                    {selectedCourse && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{selectedCourse.title}</h3>
                          <p className="text-sm text-gray-600">{selectedCourse.description || 'Tavsif yo\'q'}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Narxi:</span>
                            <span className="font-semibold">{formatCurrency(selectedCourse.price)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Davomiyligi:</span>
                            <span className="font-semibold">{selectedCourse.duration || 'Belgilanmagan'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Talabalar:</span>
                            <span className="font-semibold">{selectedCourse.students || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Daraja:</span>
                            <Badge className={getLevelColor(selectedCourse.level)}>{getLevelText(selectedCourse.level)}</Badge>
                          </div>
                          {selectedCourse.category && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Kategoriya:</span>
                              <Badge variant="outline">{selectedCourse.category}</Badge>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Holati:</span>
                            <Badge className={selectedCourse.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                              {selectedCourse.isActive ? 'Faol' : 'Faol emas'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/courses/${course.id}`, { state: { from: 'courses' } })}
                  className="hover:bg-green-50 hover:text-green-600 rounded-xl h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(course.id)}
                  className="hover:bg-red-50 hover:text-red-600 rounded-xl h-8 w-8"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin block mx-auto"></span>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && !isLoading && (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <BookOpen size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kurslar topilmadi</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== 'all' || levelFilter !== 'all'
                ? 'Qidiruv natijalariga mos kurslar yo\'q'
                : 'Hali hech qanday kurs qo\'shilmagan'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && levelFilter === 'all' && (
              <Button
                onClick={() => navigate('/courses/new')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Birinchi kursni qo'shing
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      {deleteError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mt-4">
          <p className="text-destructive text-sm font-medium">{(deleteError as Error)?.message || 'Kursni o‘chirishda xatolik!'}</p>
        </div>
      )}
    </div>
  );
};

export default Courses;