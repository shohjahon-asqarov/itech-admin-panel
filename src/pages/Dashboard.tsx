import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Phone,
  MessageSquare,
  Star,
  Plus,
  RefreshCw,
  BarChart as BarChartIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CardLoading } from '../components/ui/loading';
import { showToast } from '../components/ui/toast';
import { DashboardService } from '../services/dashboardService';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
  monthlyCourses?: { month: string; value: number }[];
  monthlyLeads?: { month: string; value: number }[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: stats,
    isLoading: loading,
    isFetching: refreshing,
    refetch,
    isError,
    error
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: DashboardService.getStatistics,
  });

  const handleRefresh = async () => {
    const res = await refetch();
    if (res.isSuccess) {
      showToast.success("Ma'lumotlar yangilandi");
    } else {
      showToast.error("Ma'lumotlarni yangilashda xatolik");
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

  // MOCK DATA (agar stats.monthlyCourses bo‘lmasa, vaqtincha ishlatish uchun)
  const monthlyCourses = stats?.monthlyCourses || [
    { month: 'Yan', value: 2 },
    { month: 'Fev', value: 3 },
    { month: 'Mar', value: 5 },
    { month: 'Apr', value: 4 },
    { month: 'May', value: 6 },
    { month: 'Iyun', value: 7 },
  ];

  if (loading) {
    return <CardLoading text="Dashboard ma'lumotlari yuklanmoqda..." />;
  }
  if (isError) {
    return <div className="flex items-center justify-center min-h-[300px]"><span>Xatolik: {(error && typeof error === 'object' && 'message' in error) ? (error as Error).message : String(error) || 'Statistikani yuklashda xatolik!'}</span></div>;
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
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300 min-h-[160px] flex flex-col justify-between">
          <div className="flex justify-between items-start p-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Jami Kurslar</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.courses.total || 0}</p>
            </div>
            <div className="p-2 bg-blue-500 rounded-xl">
              <BookOpen className="text-white" size={22} />
            </div>
          </div>
          <div className="flex gap-2 px-4 pb-4 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">{stats?.courses.active || 0} faol</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">{stats?.courses.inactive || 0} faol emas</span>
          </div>
        </Card>

        {/* Teachers Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300 min-h-[160px] flex flex-col justify-between">
          <div className="flex justify-between items-start p-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">O'qituvchilar</p>
              <p className="text-3xl font-bold text-green-600">{stats?.teachers.total || 0}</p>
            </div>
            <div className="p-2 bg-green-500 rounded-xl">
              <Users className="text-white" size={22} />
            </div>
          </div>
          <div className="flex gap-2 px-4 pb-4 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">{stats?.teachers.active || 0} faol</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">{stats?.teachers.inactive || 0} faol emas</span>
          </div>
        </Card>

        {/* Leads Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300 min-h-[160px] flex flex-col justify-between">
          <div className="flex justify-between items-start p-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Lidlar</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.leads.total || 0}</p>
            </div>
            <div className="p-2 bg-purple-500 rounded-xl">
              <Phone className="text-white" size={22} />
            </div>
          </div>
          <div className="flex gap-2 px-4 pb-4 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{stats?.leads.new || 0} yangi</span>
            <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-medium">{stats?.leads.enrolled || 0} ro'yxatdan o'tgan</span>
          </div>
        </Card>

        {/* Testimonials Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-xl transition-all duration-300 min-h-[160px] flex flex-col justify-between">
          <div className="flex justify-between items-start p-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Fikrlar</p>
              <p className="text-3xl font-bold text-yellow-600">{stats?.testimonials.total || 0}</p>
            </div>
            <div className="p-2 bg-yellow-500 rounded-xl">
              <MessageSquare className="text-white" size={22} />
            </div>
          </div>
          <div className="flex gap-2 px-4 pb-4 flex-wrap items-center">
            <div className="flex items-center space-x-1">
              {renderStars(Number(stats?.testimonials.averageRating || 0))}
              <span className="text-xs text-gray-600 ml-1">{stats?.testimonials.averageRating || '0.0'}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Stats and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Diagramma: So‘nggi 6 oyda kurslar soni */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChartIcon className="h-5 w-5 text-blue-600" />
              <span>So‘nggi 6 oyda kurslar soni</span>
            </CardTitle>
            <CardDescription>
              Oylik kurslar statistikasi (demo)
            </CardDescription>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCourses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 14 }} />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
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
                {/* <Eye className="w-4 h-4" /> */}
                <span>Barcha Kurslar</span>
              </Button>

              <Button
                onClick={() => navigate('/leads')}
                variant="outline"
                className="flex items-center justify-center space-x-2"
              >
                {/* <Eye className="w-4 h-4" /> */}
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
                <div
                  key={category}
                  className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <p className="text-3xl font-extrabold text-blue-700 mb-1">{String(count)}</p>
                  <p className="text-base font-medium text-gray-700 capitalize truncate max-w-[120px]">{category}</p>
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