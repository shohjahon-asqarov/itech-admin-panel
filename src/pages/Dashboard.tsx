import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Phone,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  DollarSign,
  Star,
  Eye,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner, CardLoading } from '@/components/ui/loading';
import { showToast } from '@/components/ui/toast';
import { useCrud } from '@/hooks/useApi';
import { CourseService } from '@/services/courseService';
import { TeacherService } from '@/services/teacherService';
import { LeadService } from '@/services/leadService';
import { TestimonialService } from '@/services/testimonialService';
import { DashboardService } from '@/services/dashboardService';
import { formatDate, formatCurrency } from '@/utils';

interface DashboardStats {
  courses: {
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<string, number>;
  };
  teachers: {
    total: number;
    active: number;
    inactive: number;
  };
  leads: {
    total: number;
    new: number;
    contacted: number;
    enrolled: number;
    rejected: number;
  };
  testimonials: {
    total: number;
    averageRating: number;
    fiveStar: number;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Statistikani olish
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await DashboardService.getStatistics();
      setStats(res); // <-- faqat res, .data emas
    } catch (error) {
      showToast.error('Statistikani olishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchStats();
      showToast.success('Ma\'lumotlar yangilandi');
    } catch (error) {
      showToast.error('Ma\'lumotlarni yangilashda xatolik');
    } finally {
      setRefreshing(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  if (loading) {
    return <CardLoading text="Dashboard ma'lumotlari yuklanmoqda..." />;
  }

  return (
    <div className="space-y-6 lg:space-y-8 p-4 lg:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Loyihangizning umumiy holati va statistikasi
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Yangilash
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Courses Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Jami Kurslar</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.courses.total || 0}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {stats?.courses.active || 0} faol
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {stats?.courses.inactive || 0} faol emas
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl">
                <BookOpen className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teachers Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">O'qituvchilar</p>
                <p className="text-3xl font-bold text-green-600">{stats?.teachers.total || 0}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {stats?.teachers.active || 0} faol
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {stats?.teachers.inactive || 0} faol emas
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-green-500 rounded-xl">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Lidlar</p>
                <p className="text-3xl font-bold text-purple-600">{stats?.leads.total || 0}</p>
                <div className="flex items-center mt-2 space-x-1">
                  <Badge variant="secondary" className="text-xs">
                    {stats?.leads.new || 0} yangi
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {stats?.leads.enrolled || 0} ro'yxatdan o'tgan
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl">
                <Phone className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Fikrlar</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.testimonials.total || 0}</p>
                <div className="flex items-center mt-2 space-x-1">
                  <div className="flex items-center space-x-1">
                    {renderStars(Math.round(parseFloat(stats?.testimonials.averageRating || '0')))}
                  </div>
                  <span className="text-xs text-gray-600 ml-1">
                    {stats?.testimonials.averageRating || '0.0'}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-yellow-500 rounded-xl">
                <MessageSquare className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Activity */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>So'nggi Faollik</span>
            </CardTitle>
            <CardDescription>
              So'nggi qo'shilgan va yangilangan ma'lumotlar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recent Courses */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">So'nggi Kurslar</h4>
              {/* This section will need to be refactored to fetch recent courses directly */}
              {/* For now, it will show a placeholder or empty */}
              <p>So'nggi Kurslar ma'lumotlari yuklanmoqda...</p>
            </div>

            {/* Recent Leads */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">So'nggi Lidlar</h4>
              {/* This section will need to be refactored to fetch recent leads directly */}
              {/* For now, it will show a placeholder or empty */}
              <p>So'nggi Lidlar ma'lumotlari yuklanmoqda...</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-green-600" />
              <span>Tezkor Amallar</span>
            </CardTitle>
            <CardDescription>
              Tezda yangi ma'lumot qo'shish va boshqarish
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate('/courses/new')}
                className="h-20 bg-gradient-to-br from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <div className="text-center">
                  <BookOpen className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Yangi Kurs</span>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/teachers/new')}
                className="h-20 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <div className="text-center">
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Yangi O'qituvchi</span>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/leads/new')}
                className="h-20 bg-gradient-to-br from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
              >
                <div className="text-center">
                  <Phone className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Yangi Lid</span>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/testimonials/new')}
                className="h-20 bg-gradient-to-br from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
              >
                <div className="text-center">
                  <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Yangi Fikr</span>
                </div>
              </Button>
            </div>

            {/* View All Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
              <Button
                onClick={() => navigate('/courses')}
                variant="outline"
                className="flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Barcha Kurslar</span>
              </Button>

              <Button
                onClick={() => navigate('/leads')}
                variant="outline"
                className="flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Barcha Lidlar</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      {stats?.courses.byCategory && Object.keys(stats.courses.byCategory).length > 0 && (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Kurslar Kategoriya Bo'yicha</CardTitle>
            <CardDescription>
              Kurslarning kategoriyalar bo'yicha taqsimlanishi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.courses.byCategory).map(([category, count]) => (
                <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{count}</p>
                  <p className="text-sm text-gray-600">{category}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;