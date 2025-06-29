import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Phone, Mail, User, BookOpen, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { mockLeads, mockCourses } from '@/data/mockData';
import { Lead } from '@/types';

const LeadForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id && id !== 'new');
  
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    phone: '',
    email: '',
    course: '',
    status: 'new',
    source: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const lead = mockLeads.find(l => l.id === id);
      if (lead) {
        setFormData(lead);
      } else {
        toast.error('Lid topilmadi!');
        navigate('/leads');
      }
    }
  }, [id, isEdit, navigate]);

  const handleInputChange = (field: keyof Lead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.phone || !formData.course || !formData.source) {
        toast.error('Barcha majburiy maydonlarni to\'ldiring!');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isEdit) {
        toast.success('Lid ma\'lumotlari muvaffaqiyatli yangilandi!', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.success('Yangi lid muvaffaqiyatli qo\'shildi!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
      
      navigate('/leads');
    } catch (error) {
      toast.error('Ma\'lumotlarni saqlashda xatolik yuz berdi!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Lidni o\'chirishni xohlaysizmi?')) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Lid muvaffaqiyatli o\'chirildi!', {
        position: "top-right",
        autoClose: 3000,
      });
      
      navigate('/leads');
    } catch (error) {
      toast.error('Lidni o\'chirishda xatolik yuz berdi!');
    } finally {
      setLoading(false);
    }
  };

  const sources = ['Website', 'Instagram', 'Facebook', 'Telegram', 'Referral', 'Google Ads'];
  const statuses: Lead['status'][] = ['new', 'contacted', 'enrolled', 'cancelled'];

  const getStatusText = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'Yangi';
      case 'contacted': return 'Aloqa qilindi';
      case 'enrolled': return "Ro'yxatdan o'tdi";
      case 'cancelled': return 'Bekor qilindi';
      default: return status;
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
            onClick={() => navigate('/leads')}
            className="hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {isEdit ? 'Lidni Tahrirlash' : 'Yangi Lid Qo\'shish'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Mavjud lid ma\'lumotlarini yangilang' : 'Yangi lid uchun barcha ma\'lumotlarni kiriting'}
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
                <CardDescription>Lid haqida asosiy ma'lumotlarni kiriting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">To'liq ism *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masalan: Akmal Toshmatov"
                      className="rounded-xl border-gray-200"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Telefon raqam *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+998901234567"
                        className="pl-10 rounded-xl border-gray-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@email.com"
                      className="pl-10 rounded-xl border-gray-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course" className="text-sm font-medium">Qiziqish bildirgan kurs *</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Select value={formData.course} onValueChange={(value) => handleInputChange('course', value)}>
                        <SelectTrigger className="pl-10 rounded-xl border-gray-200">
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="source" className="text-sm font-medium">Manba *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                        <SelectTrigger className="pl-10 rounded-xl border-gray-200">
                          <SelectValue placeholder="Manba tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {sources.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Izohlar</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Qo'shimcha ma'lumotlar..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Status</CardTitle>
                <CardDescription>Lid holatini belgilang</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Joriy status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as Lead['status'])}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {getStatusText(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  onClick={() => navigate('/leads')}
                  className="w-full rounded-xl border-gray-200 hover:bg-gray-50"
                  disabled={loading}
                >
                  Bekor qilish
                </Button>
                
                {isEdit && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full rounded-xl"
                    onClick={handleDelete}
                    disabled={loading}
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

export default LeadForm;