// React va asosiy kutubxonalar
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Ikonalar
import { ArrowLeft, Save, User, BookOpen, MessageSquare } from 'lucide-react';

// Loyiha UI komponentlari
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

// Toast
import { showToast } from '../components/ui/toast';

// Loyiha servis va types
import { Lead } from '../types';
import { LeadService } from '../services';
import { CourseService } from '../services/courseService';

// Form qiymatlari tipi
type FormValues = {
  name: string;
  email: string;
  phone: string;
  courseId: string;
  message: string;
  status: string;
};

const LeadForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // Kurslar ro‘yxati
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await CourseService.getAll();
        setCourses((res as { id: string; title: string }[]).map((c: { id: string; title: string }) => ({ id: c.id, title: c.title })));
      } catch {
        showToast.error('Kurslar yuklanmadi');
      }
    })();
  }, []);

  // Form hook
  const { register, handleSubmit, setValue, reset, control, formState: { errors, isSubmitting, isValid } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      courseId: '',
      message: '',
      status: 'NEW',
    }
  });

  const { data: lead, isLoading: isLeadLoading } = useQuery<Lead>({
    queryKey: ['lead', id],
    queryFn: () => LeadService.getById(id as string),
    enabled: isEditing && !!id,
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        courseId: lead.course?.id || '',
        message: lead.message || '',
        status: lead.status,
      });
    }
  }, [lead, reset]);

  // Submit
  const onSubmit = async (data: FormValues) => {
    try {
      const submitData: Record<string, unknown> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        courseId: data.courseId,
        message: data.message,
      };
      if (isEditing && id) {
        submitData.status = data.status?.toUpperCase();
        await LeadService.update(id as string, submitData);
        showToast.success("Lead yangilandi!");
      } else {
        await LeadService.create(submitData);
        showToast.success("Yangi lead qo'shildi!");
      }
      navigate('/leads');
    } catch (error) {
      showToast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    }
  };

  // Status variantlari
  const statuses = [
    { value: 'NEW', label: 'Yangi' },
    { value: 'CONTACTED', label: 'Bog\'lanish' },
    { value: 'ENROLLED', label: 'Ro\'yxatdan o\'tgan' },
    { value: 'REJECTED', label: 'Bekor qilindi' }
  ];

  if (isLeadLoading) {
    return <div className="flex items-center justify-center min-h-[300px]"><span>Lead ma'lumotlari yuklanmoqda...</span></div>;
  }

  return (
    <div className="space-y-6 lg:space-y-8 p-4 lg:p-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/leads')}
            className="hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {isEditing ? 'Leadni tahrirlash' : 'Yangi lead'}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {isEditing ? 'Lead ma\'lumotlarini yangilang' : 'Yangi lead qo\'shing'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Asosiy ma'lumotlar</span>
                </CardTitle>
                <CardDescription>
                  Potensial talaba haqida asosiy ma'lumotlar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">To'liq ism *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: true })}
                    placeholder="Potensial talaba ismi"
                    className="rounded-xl border-gray-200"
                  />
                  {errors.name && <span className="text-red-500 text-xs">Ism majburiy</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', { required: true })}
                      placeholder="email@example.com"
                      className="rounded-xl border-gray-200"
                    />
                    {errors.email && <span className="text-red-500 text-xs">Email majburiy</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon raqam</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="+998 90 123 45 67"
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseId">Qiziqish bildirgan kurs *</Label>
                  <Controller
                    name="courseId"
                    control={control}
                    rules={{ required: 'Kurs tanlash majburiy' }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="rounded-xl border-gray-200">
                          <SelectValue placeholder="Kurs tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map(course => (
                            <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.courseId && <span className="text-destructive text-xs">{errors.courseId.message}</span>}
                </div>
              </CardContent>
            </Card>

            {/* Message */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <span>Xabar</span>
                </CardTitle>
                <CardDescription>
                  Potensial talabaning xabari yoki qo'shimcha ma'lumotlari
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="message">Xabar matni</Label>
                  <Textarea
                    id="message"
                    {...register('message')}
                    placeholder="Potensial talabaning xabari..."
                    rows={4}
                    className="rounded-xl border-gray-200 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status and Submit */}
          <div className="space-y-6">
            {/* Status maydoni faqat admin uchun update bo‘lsa ko‘rsatiladi */}
            {isEditing && (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <span>Holat</span>
                  </CardTitle>
                  <CardDescription>
                    Leadning joriy holati
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="status">Lead holati *</Label>
                    <Select
                      value={undefined}
                      onValueChange={(value) => setValue('status', value)}
                    >
                      <SelectTrigger className="rounded-xl border-gray-200">
                        <SelectValue placeholder="Holat tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(status => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg transition-all duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Kuting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Saqlash</span>
                      <Save size={20} />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;