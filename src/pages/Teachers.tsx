import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Mail, Phone, MapPin, Star, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { Teacher } from '@/types';
import { TeacherService } from '@/services';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/utils';

const Teachers: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const queryClient = useQueryClient();

  // Fetch teachers (GET)
  const {
    data: teachers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      return await TeacherService.getAll();
    },
  });

  // Delete teacher (DELETE)
  const {
    mutate: deleteTeacher,
    isLoading: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: (id: string) => TeacherService.delete(id),
    onSuccess: () => {
      toast.success("O'qituvchi muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "O'qituvchini o‘chirishda xatolik!");
    },
  });

  const filteredTeachers = teachers.filter((teacher: Teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = specializationFilter === 'all' || teacher.specialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  const specializations = Array.from(new Set(teachers.map(t => t.specialization)));

  const stats = {
    total: teachers.length,
    active: teachers.filter(t => t.isActive).length,
    inactive: teachers.filter(t => !t.isActive).length,
  };

  const handleDelete = (teacherId: string) => {
    if (confirm('O\'qituvchini o\'chirishni xohlaysizmi?')) {
      deleteTeacher(teacherId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">O'qituvchilar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-600">Xatolik: {(error as Error)?.message || `O'qituvchilarni yuklashda xatolik!`}</p>
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
            O'qituvchilar
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">O'qituvchilarni boshqarish va kuzatish</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Jami O'qituvchilar</p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="p-2 lg:p-3 bg-blue-500 rounded-xl lg:rounded-2xl">
                <Users className="text-white" size={20} />
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
                <Users className="text-white" size={20} />
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
                  placeholder="Ism yoki ixtisoslik bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-gray-200">
                  <SelectValue placeholder="Ixtisoslik tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha ixtisosliklar</SelectItem>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 lg:w-14 lg:h-14 ring-2 ring-gray-200">
                    <AvatarImage src={teacher.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base lg:text-lg font-bold text-gray-900 truncate">{teacher.name}</CardTitle>
                    <CardDescription className="text-gray-600 text-sm truncate">{teacher.specialization}</CardDescription>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${teacher.isActive
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                  {teacher.isActive ? 'Faol' : 'Faol emas'}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                {teacher.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{teacher.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{teacher.experience} yillik tajriba</span>
                </div>
              </div>

              {teacher.bio && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-600 italic line-clamp-2">"{teacher.bio}"</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {formatDate(teacher.createdAt)}
                </p>

                <div className="flex items-center space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedTeacher(teacher)}
                        className="hover:bg-blue-50 hover:text-blue-600 rounded-xl h-8 w-8"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>O'qituvchi ma'lumotlari</DialogTitle>
                        <DialogDescription>
                          {selectedTeacher?.name} haqida batafsil ma'lumot
                        </DialogDescription>
                      </DialogHeader>
                      {selectedTeacher && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={selectedTeacher.image || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {selectedTeacher.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{selectedTeacher.name}</h3>
                              <p className="text-sm text-gray-600">{selectedTeacher.specialization}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Mail size={16} className="mr-2 text-gray-400" />
                              <span>{selectedTeacher.email}</span>
                            </div>
                            {selectedTeacher.phone && (
                              <div className="flex items-center text-sm">
                                <Phone size={16} className="mr-2 text-gray-400" />
                                <span>{selectedTeacher.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center text-sm">
                              <MapPin size={16} className="mr-2 text-gray-400" />
                              <span>{selectedTeacher.experience} yillik tajriba</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Badge className={selectedTeacher.isActive
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                              }>
                                {selectedTeacher.isActive ? 'Faol' : 'Faol emas'}
                              </Badge>
                            </div>
                          </div>

                          {selectedTeacher.bio && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">{selectedTeacher.bio}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/teachers/${teacher.id}`)}
                    className="hover:bg-green-50 hover:text-green-600 rounded-xl h-8 w-8"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(teacher.id)}
                    className="hover:bg-red-50 hover:text-red-600 rounded-xl h-8 w-8"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin block mx-auto"></span>
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeachers.length === 0 && !isLoading && (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Users size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">O'qituvchilar topilmadi</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || specializationFilter !== 'all'
                ? 'Qidiruv natijalariga mos o\'qituvchilar yo\'q'
                : 'Hali hech qanday o\'qituvchi qo\'shilmagan'
              }
            </p>
            {!searchTerm && specializationFilter === 'all' && (
              <Button
                onClick={() => navigate('/teachers/new')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Birinchi o'qituvchini qo'shing
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      {deleteError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mt-4">
          <p className="text-destructive text-sm font-medium">{(deleteError as Error)?.message || `O'qituvchini o‘chirishda xatolik!`}</p>
        </div>
      )}
    </div>
  );
};

export default Teachers;