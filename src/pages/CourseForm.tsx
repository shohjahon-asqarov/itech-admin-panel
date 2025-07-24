import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { showToast } from '../components/ui/toast';
import { Course } from '../types';
import { CourseService } from '../services';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

const levels = [
  { value: 'BEGINNER', label: "Boshlang'ich" },
  { value: 'INTERMEDIATE', label: "O'rta" },
  { value: 'ADVANCED', label: "Yuqori" }
];

type FormValues = {
  title: string;
  description: string;
  price: number;
  duration: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  image: string;
  isActive: boolean;
};

const CourseForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      duration: '',
      level: 'BEGINNER',
      image: '',
      isActive: true,
    },
  });

  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => CourseService.getById(id as string),
    enabled: isEditing && !!id,
  });

  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        description: course.description || '',
        price: course.price || 0,
        duration: course.duration || '',
        level: course.level,
        image: course.image || '',
        isActive: course.isActive,
      });
      if (course.image) setValue('image', course.image);
    }
  }, [course, reset, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      const submitData: Record<string, unknown> = {
        title: data.title,
        price: Number(data.price),
        description: data.description,
        duration: data.duration,
        level: data.level,
        image: data.image,
        isActive: data.isActive
      };
      if (isEditing && id) {
        await CourseService.update(id as string, submitData);
        showToast.success("Kurs yangilandi!");
      } else {
        await CourseService.create(submitData);
        showToast.success("Yangi kurs qo'shildi!");
      }
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      navigate('/courses');
    } catch (error) {
      showToast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    }
  };

  const [imageUploading, setImageUploading] = React.useState(false);
  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiService.upload<{ url: string }>('/upload/image', formData);
      let url = response.data?.data?.url;
      if (url && !/^https?:\/\//.test(url)) {
        url = `${import.meta.env.VITE_API_URL || ''}${url}`;
      }
      if (url) {
        setValue('image', url, { shouldValidate: true, shouldDirty: true });
      }
    } catch (e) {
      showToast.error('Rasm yuklashda xatolik yuz berdi.');
    }
    setImageUploading(false);
  };

  if (isCourseLoading) {
    return <div className="flex items-center justify-center min-h-[300px]"><span>Kurs ma'lumotlari yuklanmoqda...</span></div>;
  }

  return (
    <div className="space-y-6 lg:space-y-8 p-4 lg:p-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/courses')}
            className="hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {isEditing ? 'Kursni tahrirlash' : 'Yangi kurs'}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {isEditing ? 'Kurs ma\'lumotlarini yangilang' : 'Yangi kurs qo\'shing'}
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
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>Asosiy ma'lumotlar</span>
                </CardTitle>
                <CardDescription>
                  Kursning asosiy ma'lumotlari
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Kurs nomi *</Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'Kurs nomi majburiy' })}
                    placeholder="Kurs nomini kiriting"
                    className="rounded-xl border-gray-200"
                  />
                  {errors.title && <span className="text-destructive text-xs">{errors.title.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Tavsif</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Kurs haqida batafsil ma'lumot..."
                    rows={4}
                    className="rounded-xl border-gray-200 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Daraja *</Label>
                  <Controller
                    name="level"
                    control={control}
                    rules={{ required: 'Daraja majburiy' }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-gray-200">
                          <SelectValue placeholder="Daraja tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map(level => (
                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.level && <span className="text-destructive text-xs">{errors.level.message}</span>}
                </div>
              </CardContent>
            </Card>

            {/* Course Details */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span>Kurs tafsilotlari</span>
                </CardTitle>
                <CardDescription>
                  Kursning narxi va davomiyligi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Narxi (so'm) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      {...register('price', { required: 'Narxi majburiy' })}
                      placeholder="500000"
                      className="rounded-xl border-gray-200"
                    />
                    {errors.price && <span className="text-destructive text-xs">{errors.price.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Davomiyligi</Label>
                    <Input
                      id="duration"
                      {...register('duration')}
                      placeholder="3 oy, 12 hafta"
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span>Holat</span>
                </CardTitle>
                <CardDescription>
                  Kursning faoliyat holati
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="isActive">Faol kurs</Label>
                    <p className="text-sm text-gray-600">
                      Kurs faol bo'lsa, talabalar uni ko'ra oladi
                    </p>
                  </div>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="isActive"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-purple-600" />
                  <span>Kurs rasmi</span>
                </CardTitle>
                <CardDescription>
                  Rasmni tanlang yoki bu yerga sudrab tashlang
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-2 mb-6">
                  <div
                    className={`relative w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center bg-gray-50 shadow-lg cursor-pointer transition hover:border-blue-400 overflow-hidden ${imageUploading ? 'opacity-60 pointer-events-none' : ''}`}
                    onClick={() => document.getElementById('course-image-upload')?.click()}
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
                      id="course-image-upload"
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

            {/* Submit Button */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg rounded-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saqlanmoqda...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>{isEditing ? 'Yangilash' : 'Saqlash'}</span>
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

export default CourseForm;