import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Phone, BookOpen, MessageSquare, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { Lead } from '@/types';
import { LeadService } from '@/services';
import { useFetch } from '@/hooks';
import { CourseService } from '@/services/courseService';
import { apiService } from '@/services/api';

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

  const [courses, setCourses] = React.useState<{ id: string; title: string }[]>([]);
  React.useEffect(() => {
    (async () => {
      try {
        const res = await CourseService.getAll();
        setCourses(res.map((c: any) => ({ id: c.id, title: c.title })));
      } catch {
        toast.error('Kurslar yuklanmadi');
      }
    })();
  }, []);

  const { register, handleSubmit, setValue, reset, control, getValues, formState: { errors, isSubmitting, isValid } } = useForm<FormValues>({
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

  // Fetch lead data if editing
  useEffect(() => {
    if (isEditing) {
      (async () => {
        try {
          const data = await LeadService.getById(id);
          reset({
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            courseId: data.course?.id || '',
            message: data.message || '',
            status: data.status,
          });
        } catch {
          toast.error("Lead ma'lumotlari yuklanmadi");
          navigate('/leads');
        }
      })();
    }
  }, [isEditing, id, reset, navigate]);

  // onSubmit should only send JSON, never FormData
  const onSubmit = async (data: FormValues) => {
    try {
      const submitData: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        courseId: data.courseId,
        message: data.message,
      };
      if (isEditing) {
        submitData.status = data.status?.toUpperCase();
        await LeadService.update(id, submitData);
        toast.success('Lead muvaffaqiyatli yangilandi!');
      } else {
        await LeadService.create(submitData);
        toast.success('Lead muvaffaqiyatli qo\'shildi!');
      }
      navigate('/leads');
    } catch (error) {
      toast.error('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
  };

  const statuses = [
    { value: 'NEW', label: 'Yangi' },
    { value: 'CONTACTED', label: 'Bog\'lanish' },
    { value: 'ENROLLED', label: 'Ro\'yxatdan o\'tgan' },
    { value: 'REJECTED', label: 'Bekor qilindi' }
  ];

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