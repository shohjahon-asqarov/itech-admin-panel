import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Trash2, MessageSquare, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockTestimonials, mockCourses } from '@/data/mockData';
import { Testimonial } from '@/types';

const TestimonialForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id && id !== 'new');
  
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    image: '',
    content: '',
    rating: 5,
    course: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (isEdit && id) {
      const testimonial = mockTestimonials.find(t => t.id === parseInt(id));
      if (testimonial) {
        setFormData(testimonial);
        setImagePreview(testimonial.image);
      }
    }
  }, [id, isEdit]);

  const handleInputChange = (field: keyof Testimonial, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEdit) {
        console.log('Updating testimonial:', formData);
      } else {
        console.log('Creating testimonial:', formData);
      }
      
      navigate('/testimonials');
    } catch (error) {
      console.error('Error saving testimonial:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={24}
        className={`${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-300 transition-colors' : ''}`}
        onClick={interactive ? () => handleInputChange('rating', index + 1) : undefined}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/testimonials')}
            className="hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {isEdit ? 'Sharhni Tahrirlash' : 'Yangi Sharh Qo\'shish'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Mavjud sharh ma\'lumotlarini yangilang' : 'Yangi sharh uchun barcha ma\'lumotlarni kiriting'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="text-blue-500" size={24} />
                  <span className="text-xl font-bold text-gray-900">Sharh Ma'lumotlari</span>
                </CardTitle>
                <CardDescription>Sharh beruvchi haqida asosiy ma'lumotlarni kiriting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">To'liq ism *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masalan: Sardor Alimov"
                      className="rounded-xl border-gray-200"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">Lavozim/Kasb *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      placeholder="Masalan: Frontend Developer"
                      className="rounded-xl border-gray-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course" className="text-sm font-medium">Kurs *</Label>
                  <Select value={formData.course} onValueChange={(value) => handleInputChange('course', value)}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Kurs tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCourses.map((course) => (
                        <SelectItem key={course.id} value={course.title}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium">Sharh matni *</Label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Kurs haqida fikr va taassurotlar..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Reyting *</Label>
                  <div className="flex items-center space-x-1">
                    {renderStars(formData.rating || 5, true)}
                    <span className="ml-2 text-sm text-gray-600">
                      {formData.rating}/5 yulduz
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Profil Rasmi</CardTitle>
                <CardDescription>Sharh beruvchi uchun rasm yuklang</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-600">Rasm yuklash uchun bosing</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Sharh Ko'rinishi</CardTitle>
                <CardDescription>Sharhning qanday ko'rinishini ko'ring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : 'SA'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{formData.name || 'Ism'}</p>
                      <p className="text-sm text-gray-600">{formData.role || 'Lavozim'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(formData.rating || 5)}
                  </div>
                  
                  <p className="text-sm text-gray-700 italic">
                    "{formData.content || 'Sharh matni bu yerda ko\'rinadi...'}"
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.course || 'Kurs nomi'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl py-3"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saqlanmoqda...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save size={16} />
                      <span>{isEdit ? 'Yangilash' : 'Saqlash'}</span>
                    </div>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/testimonials')}
                  className="w-full rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  Bekor qilish
                </Button>
                
                {isEdit && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full rounded-xl"
                    onClick={() => {
                      if (confirm('Sharhni o\'chirishni xohlaysizmi?')) {
                        console.log('Deleting testimonial:', id);
                        navigate('/testimonials');
                      }
                    }}
                  >
                    <Trash2 size={16} className="mr-2" />
                    O'chirish
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;