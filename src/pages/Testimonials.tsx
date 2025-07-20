import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Star, MessageSquare, User, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { Testimonial } from '@/types';
import { TestimonialService } from '@/services';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/utils';

const Testimonials: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const queryClient = useQueryClient();

  // Fetch testimonials (GET)
  const {
    data: testimonials = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      return await TestimonialService.getAll();
    },
  });

  // Delete testimonial (DELETE)
  const {
    mutate: deleteTestimonial,
    isLoading: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: (id: string) => TestimonialService.delete(id),
    onSuccess: () => {
      toast.success("Fikr muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Fikrni o‘chirishda xatolik!');
    },
  });

  const filteredTestimonials = testimonials.filter((testimonial: Testimonial) => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || testimonial.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const stats = {
    total: testimonials.length,
    averageRating: testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : '0.0',
    fiveStar: testimonials.filter(t => t.rating === 5).length,
  };

  const handleDelete = (testimonialId: string) => {
    if (confirm('Fikrni o\'chirishni xohlaysizmi?')) {
      deleteTestimonial(testimonialId);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Fikrlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-600">Xatolik: {(error as Error)?.message || 'Fikrlarni yuklashda xatolik!'}</p>
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
            Fikrlar
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">Talabalarning fikrlarini boshqarish va kuzatish</p>
        </div>
        <Button
          onClick={() => navigate('/testimonials/new')}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg rounded-xl w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yangi Fikr
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Jami Fikrlar</p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="p-2 lg:p-3 bg-blue-500 rounded-xl lg:rounded-2xl">
                <MessageSquare className="text-white" size={20} />
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
                  {renderStars(Math.round(parseFloat(stats.averageRating)))}
                </div>
                <p className="text-xl lg:text-2xl font-bold text-yellow-600 mt-1">{stats.averageRating}</p>
              </div>
              <div className="p-2 lg:p-3 bg-yellow-500 rounded-xl lg:rounded-2xl">
                <Star className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">5 Yulduzli</p>
                <p className="text-2xl lg:text-3xl font-bold text-green-600">{stats.fiveStar}</p>
              </div>
              <div className="p-2 lg:p-3 bg-green-500 rounded-xl lg:rounded-2xl">
                <Star className="text-white" size={20} />
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
                  placeholder="Ism yoki fikr matni bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-gray-200">
                  <SelectValue placeholder="Reyting tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha reytinglar</SelectItem>
                  <SelectItem value="5">5 yulduz</SelectItem>
                  <SelectItem value="4">4 yulduz</SelectItem>
                  <SelectItem value="3">3 yulduz</SelectItem>
                  <SelectItem value="2">2 yulduz</SelectItem>
                  <SelectItem value="1">1 yulduz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 lg:w-14 lg:h-14 ring-2 ring-gray-200">
                    <AvatarImage src={testimonial.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base lg:text-lg font-bold text-gray-900 truncate">{testimonial.name}</CardTitle>
                    <CardDescription className="text-gray-600 text-sm truncate">
                      {testimonial.course?.title || testimonial.course || 'Kurs belgilanmagan'}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 italic line-clamp-3">"{testimonial.content}"</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {formatDate(testimonial.createdAt)}
                </p>

                <div className="flex items-center space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedTestimonial(testimonial)}
                        className="hover:bg-blue-50 hover:text-blue-600 rounded-xl h-8 w-8"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Fikr ma'lumotlari</DialogTitle>
                        <DialogDescription>
                          {selectedTestimonial?.name} fikri haqida batafsil ma'lumot
                        </DialogDescription>
                      </DialogHeader>
                      {selectedTestimonial && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={selectedTestimonial.image || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {selectedTestimonial.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{selectedTestimonial.name}</h3>
                              <p className="text-sm text-gray-600">{selectedTestimonial.course?.title || selectedTestimonial.course || 'Kurs belgilanmagan'}</p>
                              <div className="flex items-center space-x-1 mt-1">
                                {renderStars(selectedTestimonial.rating)}
                                <span className="text-sm text-gray-500 ml-1">({selectedTestimonial.rating})</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">{selectedTestimonial.content}</p>
                          </div>

                          <div className="text-xs text-gray-500">
                            {formatDate(selectedTestimonial.createdAt)}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/testimonials/${testimonial.id}`)}
                    className="hover:bg-green-50 hover:text-green-600 rounded-xl h-8 w-8"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(testimonial.id)}
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

      {filteredTestimonials.length === 0 && !isLoading && (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <MessageSquare size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fikrlar topilmadi</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || ratingFilter !== 'all'
                ? 'Qidiruv natijalariga mos fikrlar yo\'q'
                : 'Hali hech qanday fikr qo\'shilmagan'
              }
            </p>
            {!searchTerm && ratingFilter === 'all' && (
              <Button
                onClick={() => navigate('/testimonials/new')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Birinchi fikrni qo'shing
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      {deleteError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mt-4">
          <p className="text-destructive text-sm font-medium">{(deleteError as Error)?.message || 'Fikrni o‘chirishda xatolik!'}</p>
        </div>
      )}
    </div>
  );
};

export default Testimonials;