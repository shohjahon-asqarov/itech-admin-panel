import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Award, Star, Users, BookOpen, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockInstructors } from '@/data/mockData';
import { Instructor } from '@/types';

const Teachers: React.FC = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState<Instructor[]>(mockInstructors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.skills.some(skill => 
                           skill.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    return matchesSearch;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const handleDelete = (instructorId: number) => {
    if (confirm('O\'qituvchini o\'chirishni xohlaysizmi?')) {
      setInstructors(instructors.filter(instructor => instructor.id !== instructorId));
    }
  };

  const stats = {
    total: instructors.length,
    totalStudents: instructors.reduce((sum, i) => sum + i.students, 0),
    averageRating: instructors.reduce((sum, i) => sum + i.rating, 0) / instructors.length,
    totalCourses: instructors.reduce((sum, i) => sum + i.courses.length, 0),
  };

  return (
    <div className="space-y-6 lg:space-y-8 p-4 lg:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            O'qituvchilar
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">O'qituvchilarni boshqarish va nazorat qilish</p>
        </div>
        <Button
          onClick={() => navigate('/teachers/new')}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg rounded-xl w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yangi O'qituvchi
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Jami O'qituvchilar</p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="p-2 lg:p-3 bg-blue-500 rounded-xl lg:rounded-2xl">
                <Award className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Jami Talabalar</p>
                <p className="text-2xl lg:text-3xl font-bold text-green-600">{stats.totalStudents}</p>
              </div>
              <div className="p-2 lg:p-3 bg-green-500 rounded-xl lg:rounded-2xl">
                <Users className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">O'rtacha Reyting</p>
                <div className="flex items-center space-x-1 mt-1">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <p className="text-xl lg:text-2xl font-bold text-yellow-600 mt-1">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="p-2 lg:p-3 bg-yellow-500 rounded-xl lg:rounded-2xl">
                <Star className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Jami Kurslar</p>
                <p className="text-2xl lg:text-3xl font-bold text-purple-600">{stats.totalCourses}</p>
              </div>
              <div className="p-2 lg:p-3 bg-purple-500 rounded-xl lg:rounded-2xl">
                <BookOpen className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 lg:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Ism, lavozim yoki ko'nikma bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-gray-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredInstructors.map((instructor) => (
          <Card key={instructor.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Avatar className="w-12 h-12 lg:w-16 lg:h-16 ring-2 ring-gray-200">
                  <AvatarImage src={instructor.image} alt={instructor.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {instructor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="text-base lg:text-lg font-bold text-gray-900 truncate">{instructor.name}</CardTitle>
                  <CardDescription className="text-gray-600 text-sm truncate">{instructor.title}</CardDescription>
                  <p className="text-xs lg:text-sm text-gray-500 truncate">{instructor.company}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {renderStars(instructor.rating)}
                <span className="text-sm text-gray-500 ml-1">({instructor.rating})</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">{instructor.bio}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Users size={14} className="mr-2" />
                    Talabalar
                  </div>
                  <span className="font-semibold text-gray-900">{instructor.students}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <BookOpen size={14} className="mr-2" />
                    Kurslar
                  </div>
                  <span className="font-semibold text-gray-900">{instructor.courses.length}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Award size={14} className="mr-2" />
                    Tajriba
                  </div>
                  <span className="font-semibold text-gray-900">{instructor.experience}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Ko'nikmalar:</p>
                <div className="flex flex-wrap gap-1">
                  {instructor.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100">
                      {skill}
                    </Badge>
                  ))}
                  {instructor.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{instructor.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-1 pt-2 border-t border-gray-100">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedInstructor(instructor)}
                      className="hover:bg-blue-50 hover:text-blue-600 rounded-xl h-8 w-8"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{instructor.name}</DialogTitle>
                      <DialogDescription>O'qituvchi tafsilotlari</DialogDescription>
                    </DialogHeader>
                    {selectedInstructor && (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-20 h-20 ring-2 ring-gray-200">
                            <AvatarImage src={selectedInstructor.image} alt={selectedInstructor.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                              {selectedInstructor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h3 className="text-xl font-semibold">{selectedInstructor.name}</h3>
                            <p className="text-gray-600">{selectedInstructor.title}</p>
                            <p className="text-sm text-gray-500">{selectedInstructor.company}</p>
                            <div className="flex items-center space-x-1">
                              {renderStars(selectedInstructor.rating)}
                              <span className="text-sm text-gray-500 ml-1">({selectedInstructor.rating})</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium mb-2">Bio</p>
                          <p className="text-gray-600">{selectedInstructor.bio}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">Talabalar</p>
                            <p className="text-gray-600">{selectedInstructor.students}</p>
                          </div>
                          <div>
                            <p className="font-medium">Tajriba</p>
                            <p className="text-gray-600">{selectedInstructor.experience}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium mb-2">Ko'nikmalar</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedInstructor.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium mb-2">Kurslar</p>
                          <div className="space-y-1">
                            {selectedInstructor.courses.map((course, index) => (
                              <p key={index} className="text-sm text-gray-600">• {course}</p>
                            ))}
                          </div>
                        </div>
                        
                        {selectedInstructor.achievements && (
                          <div>
                            <p className="font-medium mb-2">Yutuqlar</p>
                            <div className="space-y-1">
                              {selectedInstructor.achievements.map((achievement, index) => (
                                <p key={index} className="text-sm text-gray-600">• {achievement}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/teachers/${instructor.id}`)}
                  className="hover:bg-green-50 hover:text-green-600 rounded-xl h-8 w-8"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(instructor.id)}
                  className="hover:bg-red-50 hover:text-red-600 rounded-xl h-8 w-8"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Teachers;