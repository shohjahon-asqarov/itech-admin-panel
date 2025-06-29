import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Eye, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockTestimonials } from '@/data/mockData';
import { Testimonial } from '@/types';

const Testimonials: React.FC = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleDelete = (testimonialId: number) => {
    if (confirm('Sharhni o\'chirishni xohlaysizmi?')) {
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== testimonialId));
    }
  };

  const stats = {
    total: testimonials.length,
    averageRating: testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length,
    fiveStars: testimonials.filter(t => t.rating === 5).length,
    fourStars: testimonials.filter(t => t.rating === 4).length,
  };

  return (
    <div className="space-y-6 lg:space-y-8 p-4 lg:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Sharhlar
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">Talabalar sharhlarini boshqarish va ko'rish</p>
        </div>
        <Button
          onClick={() => navigate('/testimonials/new')}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg rounded-xl w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yangi Sharh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="text-center">
              <p className="text-2xl lg:text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs lg:text-sm text-gray-600">Jami Sharhlar</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</p>
              <p className="text-xs lg:text-sm text-gray-600">O'rtacha Reyting</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="text-center">
              <p className="text-2xl lg:text-3xl font-bold text-green-600">{stats.fiveStars}</p>
              <p className="text-xs lg:text-sm text-gray-600">5 Yulduzli</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="text-center">
              <p className="text-2xl lg:text-3xl font-bold text-purple-600">{stats.fourStars}</p>
              <p className="text-xs lg:text-sm text-gray-600">4 Yulduzli</p>
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
              placeholder="Talaba nomi, kurs yoki sharh bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-gray-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Avatar className="w-10 h-10 lg:w-12 lg:h-12 ring-2 ring-gray-200">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="text-base lg:text-lg font-bold text-gray-900 truncate">{testimonial.name}</CardTitle>
                  <CardDescription className="text-gray-600 text-sm truncate">{testimonial.role}</CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {renderStars(testimonial.rating)}
                <span className="text-sm text-gray-500 ml-1">({testimonial.rating}/5)</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-3 lg:p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm italic line-clamp-3 text-gray-700">"{testimonial.content}"</p>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">{testimonial.course}</Badge>
                
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
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Sharh Tafsilotlari</DialogTitle>
                        <DialogDescription>Talaba sharhi to'liq ko'rinishi</DialogDescription>
                      </DialogHeader>
                      {selectedTestimonial && (
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-16 h-16 ring-2 ring-gray-200">
                              <AvatarImage src={selectedTestimonial.image} alt={selectedTestimonial.name} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {selectedTestimonial.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <h3 className="text-xl font-semibold">{selectedTestimonial.name}</h3>
                              <p className="text-gray-600">{selectedTestimonial.role}</p>
                              <Badge variant="outline">{selectedTestimonial.course}</Badge>
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-medium mb-2">Reyting</p>
                            <div className="flex items-center space-x-1">
                              {renderStars(selectedTestimonial.rating)}
                              <span className="text-lg font-semibold ml-2">{selectedTestimonial.rating}/5</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-medium mb-2">Sharh</p>
                            <div className="p-4 bg-gray-50 rounded-xl">
                              <p className="italic text-gray-700">"{selectedTestimonial.content}"</p>
                            </div>
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
                  >
                    <Trash2 className="h-3 w-3" />
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

export default Testimonials;