import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Plus, Trash2, User, Award, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { mockInstructors } from '@/data/mockData';
import { Instructor } from '@/types';

const TeacherForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id && id !== 'new');
  
  const [formData, setFormData] = useState<Partial<Instructor>>({
    name: '',
    title: '',
    company: '',
    bio: '',
    image: '',
    skills: [],
    experience: '',
    achievements: [],
    social: {
      linkedin: '',
      twitter: '',
      github: '',
      website: '',
      youtube: ''
    }
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (isEdit && id) {
      const teacher = mockInstructors.find(t => t.id === parseInt(id));
      if (teacher) {
        setFormData(teacher);
        setImagePreview(teacher.image);
      }
    }
  }, [id, isEdit]);

  const handleInputChange = (field: keyof Instructor, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field: keyof Instructor['social'], value: string) => {
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [field]: value }
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim() && !formData.achievements?.includes(newAchievement.trim())) {
      setFormData(prev => ({
        ...prev,
        achievements: [...(prev.achievements || []), newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (achievementToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.filter(achievement => achievement !== achievementToRemove) || []
    }));
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
        console.log('Updating teacher:', formData);
      } else {
        console.log('Creating teacher:', formData);
      }
      
      navigate('/teachers');
    } catch (error) {
      console.error('Error saving teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/teachers')}
            className="hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {isEdit ? 'O\'qituvchini Tahrirlash' : 'Yangi O\'qituvchi Qo\'shish'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Mavjud o\'qituvchi ma\'lumotlarini yangilang' : 'Yangi o\'qituvchi uchun barcha ma\'lumotlarni kiriting'}
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
                  <User className="text-blue-500" size={24} />
                  <span className="text-xl font-bold text-gray-900">Shaxsiy Ma'lumotlar</span>
                </CardTitle>
                <CardDescription>O'qituvchi haqida asosiy ma'lumotlarni kiriting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">To'liq ism *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masalan: Olim Yusupov"
                      className="rounded-xl border-gray-200"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">Lavozim *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Masalan: Senior Frontend Developer"
                      className="rounded-xl border-gray-200"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">Kompaniya</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Masalan: TechCorp"
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium">Tajriba *</Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="Masalan: 5+ yil"
                      className="rounded-xl border-gray-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">Bio *</Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="O'qituvchi haqida batafsil ma'lumot..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Ko'nikmalar</CardTitle>
                <CardDescription>O'qituvchining texnik ko'nikmalarini qo'shing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Ko'nikma nomini kiriting..."
                    className="flex-1 rounded-xl border-gray-200"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.skills?.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Award className="text-yellow-500" size={24} />
                  <span className="text-xl font-bold text-gray-900">Yutuqlar</span>
                </CardTitle>
                <CardDescription>O'qituvchining yutuq va sertifikatlarini qo'shing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Yutuq yoki sertifikat nomini kiriting..."
                    className="flex-1 rounded-xl border-gray-200"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddAchievement}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.achievements?.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-200"
                    >
                      <span className="text-sm font-medium text-gray-900">{achievement}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(achievement)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="text-green-500" size={24} />
                  <span className="text-xl font-bold text-gray-900">Ijtimoiy Tarmoqlar</span>
                </CardTitle>
                <CardDescription>O'qituvchining ijtimoiy tarmoq havolalarini qo'shing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-sm font-medium">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.social?.linkedin}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="github" className="text-sm font-medium">GitHub</Label>
                    <Input
                      id="github"
                      value={formData.social?.github}
                      onChange={(e) => handleSocialChange('github', e.target.value)}
                      placeholder="https://github.com/username"
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-sm font-medium">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.social?.twitter}
                      onChange={(e) => handleSocialChange('twitter', e.target.value)}
                      placeholder="https://twitter.com/username"
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                    <Input
                      id="website"
                      value={formData.social?.website}
                      onChange={(e) => handleSocialChange('website', e.target.value)}
                      placeholder="https://website.com"
                      className="rounded-xl border-gray-200"
                    />
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
                <CardDescription>O'qituvchi uchun rasm yuklang</CardDescription>
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
                  onClick={() => navigate('/teachers')}
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
                      if (confirm('O\'qituvchini o\'chirishni xohlaysizmi?')) {
                        console.log('Deleting teacher:', id);
                        navigate('/teachers');
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

export default TeacherForm;