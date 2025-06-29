import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Users, Calendar, DollarSign, Clock, Eye, Edit, Star, Trash2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockCourses } from '@/data/mockData';
import { Course } from '@/types';

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const getLevelVariant = (level: Course['level']) => {
    switch (level) {
      case "Boshlang'ich": return 'success';
      case "O'rta": return 'warning';
      case "Yuqori": return 'destructive';
      default: return 'default';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const handleDelete = (courseId: number) => {
    if (confirm('Kursni o\'chirishni xohlaysizmi?')) {
      setCourses(courses.filter(course => course.id !== courseId));
    }
  };

  const stats = {
    total: courses.length,
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0),
    averageRating: courses.reduce((sum, c) => sum + c.rating, 0) / courses.length,
    totalRevenue: courses.reduce((sum, c) => sum + (parseInt(c.price.replace(/[^\d]/g, '')) * c.students), 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Kurslar
          </h1>
          <p className="text-gray-600">Kurslarni boshqarish va nazorat qilish</p>
        </div>
        <Button
          onClick={() => navigate('/courses/new')}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yangi Kurs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Jami Kurslar</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-2xl">
                <Calendar className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Jami Talabalar</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalStudents}</p>
              </div>
              <div className="p-3 bg-green-500 rounded-2xl">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">O'rtacha Reyting</p>
                <div className="flex items-center space-x-1 mt-1">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-2xl">
                <Star className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Jami Daromad</p>
                <p className="text-3xl font-bold text-purple-600">
                  {(stats.totalRevenue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-2xl">
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Kurs nomi, o'qituvchi yoki tavsif bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[180px] rounded-xl border-gray-200">
                  <SelectValue placeholder="Daraja tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha darajalar</SelectItem>
                  <SelectItem value="Boshlang'ich">Boshlang'ich</SelectItem>
                  <SelectItem value="O'rta">O'rta</SelectItem>
                  <SelectItem value="Yuqori">Yuqori</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm overflow-hidden group">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <Badge variant={getLevelVariant(course.level)} className="shadow-lg">
                  {course.level}
                </Badge>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="text-gray-600">{course.instructor}</CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {renderStars(course.rating)}
                <span className="text-sm text-gray-500 ml-1">({course.rating})</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Users size={16} className="mr-2" />
                    Talabalar
                  </div>
                  <span className="font-semibold text-gray-900">{course.students}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock size={16} className="mr-2" />
                    Davomiyligi
                  </div>
                  <span className="font-semibold text-gray-900">{course.duration}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <DollarSign size={16} className="mr-2" />
                    Narx
                  </div>
                  <span className="font-semibold text-green-600">{course.price}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Ko'nikmalar:</p>
                <div className="flex flex-wrap gap-1">
                  {course.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100">
                      {skill}
                    </Badge>
                  ))}
                  {course.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{course.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <Badge variant="outline" className="text-xs">{course.category}</Badge>
                
                <div className="flex items-center space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedCourse(course)}
                        className="hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{course.title}</DialogTitle>
                        <DialogDescription>Kurs tafsilotlari</DialogDescription>
                      </DialogHeader>
                      {selectedCourse && (
                        <div className="space-y-6">
                          <img
                            src={selectedCourse.image}
                            alt={selectedCourse.title}
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium">O'qituvchi</p>
                              <p className="text-gray-600">{selectedCourse.instructor}</p>
                            </div>
                            <div>
                              <p className="font-medium">Daraja</p>
                              <Badge variant={getLevelVariant(selectedCourse.level)}>
                                {selectedCourse.level}
                              </Badge>
                            </div>
                            <div>
                              <p className="font-medium">Davomiyligi</p>
                              <p className="text-gray-600">{selectedCourse.duration}</p>
                            </div>
                            <div>
                              <p className="font-medium">Narx</p>
                              <p className="text-green-600 font-semibold">{selectedCourse.price}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-medium mb-2">Tavsif</p>
                            <p className="text-gray-600">{selectedCourse.description}</p>
                          </div>
                          
                          <div>
                            <p className="font-medium mb-2">O'rganiladigan ko'nikmalar</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedCourse.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="hover:bg-green-50 hover:text-green-600 rounded-xl"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(course.id)}
                    className="hover:bg-red-50 hover:text-red-600 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;