import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, MessageSquare, Star, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { Testimonial } from '@/types';
import { TestimonialService } from '@/services';
import { useFetch } from '@/hooks';
import { apiService } from '@/services';

const ratings = [
  { value: '5', label: '5 yulduz - Ajoyib' },
  { value: '4', label: '4 yulduz - Yaxshi' },
  { value: '3', label: '3 yulduz - O\'rtacha' },
  { value: '2', label: '2 yulduz - Yomon' },
  { value: '1', label: '1 yulduz - Juda yomon' }
];

// Remove courseId from FormValues
type FormValues = {
  name: string;
  content: string;
  rating: string; // keep as string for select, convert to number before sending
  image: string; // will store the image URL for preview and submission
};

const TestimonialForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // Remove courses state and effect

  // Add image file state
  const [imageUploading, setImageUploading] = React.useState(false);

  const { register, handleSubmit, setValue, reset, control, getValues, formState: { errors, isSubmitting, isValid } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      content: '',
      rating: '5',
      image: '',
    }
  });

  // Replace useFetch for edit logic to match TeacherForm
  const { execute: fetchTestimonial } = useFetch<Testimonial>(
    async () => {
      if (!id) throw new Error('ID required');
      return await TestimonialService.getById(id);
    },
    {
      onSuccess: (data: Testimonial) => {
        reset({
          name: data.name || '',
          content: data.content || '',
          rating: data.rating ? data.rating.toString() : '5',
          image: data.image ? data.image : '',
        });
      },
      onError: () => {
        toast.error('Fikr ma\'lumotlari yuklanmadi');
        navigate('/testimonials');
      },
      autoExecute: false
    }
  );

  useEffect(() => {
    if (isEditing) {
      fetchTestimonial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Image upload handler
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
    } catch {
      toast.error('Rasm yuklashda xatolik yuz berdi.');
    }
    setImageUploading(false);
  };

  // Submit handler
  const onSubmit = async (data: FormValues) => {
    try {
      if (imageUploading) {
        toast.error('Rasm yuklanmoqda. Birozdan so\'ng yuboring.');
        return;
      }
      const submitData = {
        name: data.name,
        content: data.content,
        rating: parseInt(data.rating, 10),
        image: data.image, // always a URL string
      };
      if (isEditing) {
        await TestimonialService.update(id, submitData);
        toast.success('Fikr muvaffaqiyatli yangilandi!');
      } else {
        await TestimonialService.create(submitData);
        toast.success('Fikr muvaffaqiyatli qo\'shildi!');
      }
      navigate('/testimonials');
    } catch (error) {
      toast.error('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 p-4 lg:p-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/testimonials')}
            className="hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {isEditing ? 'Fikrni tahrirlash' : 'Yangi fikr'}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {isEditing ? 'Fikr ma\'lumotlarini yangilang' : 'Yangi fikr qo\'shing'}
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
                  Talaba haqida asosiy ma'lumotlar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Talaba ismi *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Ism majburiy' })}
                    placeholder="Talaba to'liq ismi"
                    className="rounded-xl border-gray-200"
                  />
                  {errors.name && <span className="text-destructive text-xs">{errors.name.message}</span>}
                </div>
                {/* Remove courseId field */}
                <div className="space-y-2">
                  <Label htmlFor="rating">Reyting *</Label>
                  <Controller
                    name="rating"
                    control={control}
                    rules={{ required: 'Reyting majburiy' }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-gray-200">
                          <SelectValue placeholder="Reyting tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {ratings.map(rating => (
                            <SelectItem key={rating.value} value={rating.value}>{rating.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.rating && <span className="text-destructive text-xs">{errors.rating.message}</span>}
                </div>
              </CardContent>
            </Card>
            {/* Testimonial Content */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <span>Fikr matni</span>
                </CardTitle>
                <CardDescription>
                  Talabaning kurs haqidagi fikri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="content">Fikr matni *</Label>
                  <Textarea
                    id="content"
                    {...register('content', { required: 'Fikr matni majburiy' })}
                    placeholder="Talabaning kurs haqidagi fikri..."
                    rows={6}
                    className="rounded-xl border-gray-200 resize-none"
                  />
                  {errors.content && <span className="text-destructive text-xs">{errors.content.message}</span>}
                </div>
              </CardContent>
            </Card>
            {/* Image Upload */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-green-600" />
                  <span>Rasm yuklash</span>
                </CardTitle>
                <CardDescription>
                  Talaba rasmi (ixtiyoriy)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-2 mb-6">
                  <div
                    className={`relative w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center bg-gray-50 shadow-lg cursor-pointer transition hover:border-blue-400 overflow-hidden ${imageUploading ? 'opacity-60 pointer-events-none' : ''}`}
                    onClick={() => document.getElementById('testimonial-image-upload')?.click()}
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
                      id="testimonial-image-upload"
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
          {/* Save Button */}
          <div className="space-y-6">
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

export default TestimonialForm;