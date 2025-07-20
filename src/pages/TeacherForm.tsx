import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, User, Mail, Phone, MapPin, BookOpen, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-toastify';
import { Teacher } from '@/types';
import { TeacherService } from '@/services/teacherService';
import { useFetch } from '@/hooks';
import { apiService } from '@/services';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
  isActive: boolean;
};

const TeacherForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    getValues, // <-- to'g'ri joyda
    formState: { errors, isSubmitting, isValid }
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      image: '',
      isActive: true,
    }
  });

  // Fetch teacher data if editing
  const { execute: fetchTeacher, data } = useFetch<Teacher>(
    async () => {
      if (!id) throw new Error('ID required');
      return await TeacherService.getById(id);
    },
    {
      onSuccess: (data) => {
        reset({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          image: data.image || '',
          isActive: data.isActive ?? true,
        });
      },
      onError: () => {
        toast.error('O\'qituvchi ma\'lumotlari yuklanmadi');
        navigate('/teachers');
      },
      autoExecute: false
    }
  );

  useEffect(() => {
    if (isEditing) {
      fetchTeacher();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // onSubmit should only send JSON, never FormData
  const onSubmit = async (data: FormValues) => {
    try {
      const submitData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        image: data.image, // always a URL string
        isActive: data.isActive
      };
      if (isEditing) {
        await TeacherService.update(id, submitData);
        toast.success('O\'qituvchi muvaffaqiyatli yangilandi!');
      } else {
        await TeacherService.create(submitData);
        toast.success('O\'qituvchi muvaffaqiyatli qo\'shildi!');
      }
      navigate('/teachers');
    } catch (error) {
      toast.error('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
  };

  const [imageUploading, setImageUploading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiService.upload<{ url: string }>('/upload/image', formData);
      let url = response.data?.data?.url;
      // URL ni to'liq qilish (agar kerak bo'lsa)
      if (url && !/^https?:\/\//.test(url)) {
        url = `${import.meta.env.VITE_API_URL || ''}${url}`;
      }
      console.log('Uploaded image URL:', url);
      if (url) {
        setValue('image', url, { shouldValidate: true, shouldDirty: true });
      }
    } catch {
      toast.error('Rasm yuklashda xatolik yuz berdi.');
    }
    setImageUploading(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8 p-4 lg:p-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/teachers')}
            className="hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {isEditing ? 'O\'qituvchini tahrirlash' : 'Yangi o\'qituvchi'}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {isEditing ? 'O\'qituvchi ma\'lumotlarini yangilang' : 'Yangi o\'qituvchi qo\'shing'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information (faqat matnli fieldlar, rasm upload yo'q) */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Asosiy ma'lumotlar</span>
                </CardTitle>
                <CardDescription>
                  O'qituvchining shaxsiy ma'lumotlari
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">To'liq ism *</Label>
                    <Input
                      id="name"
                      {...register('name', { required: 'Ism majburiy' })}
                      placeholder="O'qituvchi ismi"
                      className="rounded-xl border-gray-200"
                    />
                    {errors.name && <span className="text-destructive text-xs">{errors.name.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email majburiy',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Email formati noto‘g‘ri'
                        }
                      })}
                      placeholder="email@example.com"
                      className="rounded-xl border-gray-200"
                    />
                    {errors.email && <span className="text-destructive text-xs">{errors.email.message}</span>}
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
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      {...register('bio')}
                      placeholder="O'qituvchi haqida qisqacha ma'lumot"
                      rows={3}
                      className="rounded-xl border-gray-200 resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-green-600" />
                  <span>O'qituvchi rasmi</span>
                </CardTitle>
                <CardDescription>
                  Rasmni tanlang yoki bu yerga sudrab tashlang
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Zamonaviy rasm upload preview */}
                <div className="flex flex-col items-center gap-2 mb-6">
                  <div
                    className={`relative w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center bg-gray-50 shadow-lg cursor-pointer transition hover:border-blue-400 overflow-hidden ${imageUploading ? 'opacity-60 pointer-events-none' : ''}`}
                    onClick={() => document.getElementById('image-upload')?.click()}
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={async e => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file) await handleImageUpload(file);
                    }}
                  >
                    {imageUploading ? (
                      <div className="w-full h-full flex items-center justify-center animate-pulse bg-gray-200 rounded-full">
                        <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 12a8 8 0 018-8" className="opacity-75" />
                        </svg>
                      </div>
                    ) : getValues('image') ? (
                      <img
                        src={getValues('image')}
                        alt="Preview image"
                        className="w-full h-full object-cover rounded-full"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Upload className="w-8 h-8 mb-1" />
                        <span className="text-xs">Rasm tanlang yoki sudrab tashlang</span>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) await handleImageUpload(file);
                      }}
                      className="hidden"
                    />
                  </div>
                  <input type="hidden" {...register('image')} />
                  {errors.image && <span className="text-destructive text-xs">{errors.image.message}</span>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status & Save */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <span>Holat</span>
                </CardTitle>
                <CardDescription>
                  O'qituvchining joriy holati
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Faol</Label>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={field.value}
                        tabIndex={0}
                        onClick={() => field.onChange(!field.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${field.value ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${field.value ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg rounded-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Kuting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-5 w-5" />
                  <span>Saqlash</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TeacherForm;