import React from 'react';
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, UserPlus, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStats } from '@/data/mockData';

const Dashboard: React.FC = () => {
  const monthlyData = [
    { month: 'Yanvar', students: 45, revenue: 12000000 },
    { month: 'Fevral', students: 52, revenue: 15000000 },
    { month: 'Mart', students: 48, revenue: 13500000 },
    { month: 'Aprel', students: 61, revenue: 18000000 },
    { month: 'May', students: 55, revenue: 16500000 },
    { month: 'Iyun', students: 67, revenue: 20000000 },
  ];

  const courseData = [
    { name: 'Frontend', value: 35, color: '#6366F1' },
    { name: 'Backend', value: 25, color: '#10B981' },
    { name: 'Mobile', value: 20, color: '#F59E0B' },
    { name: 'Digital Marketing', value: 20, color: '#EF4444' },
  ];

  const stats = [
    {
      title: 'Jami Talabalar',
      value: mockStats.totalStudents.toLocaleString(),
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12%',
      changeType: 'increase',
      description: 'Oldingi oyga nisbatan'
    },
    {
      title: "O'qituvchilar",
      value: mockStats.totalInstructors.toString(),
      icon: GraduationCap,
      gradient: 'from-emerald-500 to-green-500',
      change: '+2',
      changeType: 'increase',
      description: 'Yangi o\'qituvchilar'
    },
    {
      title: 'Kurslar',
      value: mockStats.totalCourses.toString(),
      icon: BookOpen,
      gradient: 'from-purple-500 to-violet-500',
      change: '+1',
      changeType: 'increase',
      description: 'Yangi kurs qo\'shildi'
    },
    {
      title: 'Daromad',
      value: `${(mockStats.totalRevenue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      gradient: 'from-amber-500 to-orange-500',
      change: '+8%',
      changeType: 'increase',
      description: 'Bu oylik o\'sish'
    },
    {
      title: 'Yangi Lidlar',
      value: mockStats.newLeads.toString(),
      icon: UserPlus,
      gradient: 'from-pink-500 to-rose-500',
      change: '+5',
      changeType: 'increase',
      description: 'Bu hafta'
    },
    {
      title: 'Faol Talabalar',
      value: mockStats.activeStudents.toLocaleString(),
      icon: TrendingUp,
      gradient: 'from-indigo-500 to-purple-500',
      change: '+3%',
      changeType: 'increase',
      description: 'Faollik darajasi'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Xush kelibsiz! 👋</h1>
          <p className="text-indigo-100 text-lg">Bugungi natijalaringiz va statistikalar</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}></div>
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <ArrowUp size={16} />
                    <span className="text-sm font-semibold">{stat.change}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Oylik Daromad</CardTitle>
                <CardDescription className="text-gray-600">So'nggi 6 oylik daromad statistikasi</CardDescription>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                <Activity className="text-white" size={20} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()} so'm`, 'Daromad']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Student Growth Chart */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Talabalar O'sishi</CardTitle>
                <CardDescription className="text-gray-600">Oylik yangi talabalar soni</CardDescription>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500">
                <TrendingUp className="text-white" size={20} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [value, 'Talabalar']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke="#3B82F6" 
                  strokeWidth={4}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#1D4ED8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Distribution */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Kurslar Taqsimoti</CardTitle>
            <CardDescription className="text-gray-600">Kurslar bo'yicha talabalar soni</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={courseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {courseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">So'nggi Faoliyat</CardTitle>
            <CardDescription className="text-gray-600">Tizimda so'nggi sodir bo'lgan hodisalar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-l-4 border-blue-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Yangi talaba ro'yxatdan o'tdi</p>
                  <p className="text-xs text-gray-500">5 daqiqa oldin</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700">Yangi</Badge>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-l-4 border-green-500">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Kurs to'lovi tasdiqlandi</p>
                  <p className="text-xs text-gray-500">15 daqiqa oldin</p>
                </div>
                <Badge className="bg-green-100 text-green-700">To'lov</Badge>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border-l-4 border-yellow-500">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Yangi sharh kutilmoqda</p>
                  <p className="text-xs text-gray-500">1 soat oldin</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">Kutilmoqda</Badge>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border-l-4 border-purple-500">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Yangi o'qituvchi qo'shildi</p>
                  <p className="text-xs text-gray-500">3 soat oldin</p>
                </div>
                <Badge className="bg-purple-100 text-purple-700">O'qituvchi</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;