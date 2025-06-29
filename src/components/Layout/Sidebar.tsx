import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  LogOut,
  X,
  ChevronRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null, gradient: 'from-blue-500 to-cyan-500' },
  { path: '/leads', icon: Users, label: 'Lidlar', badge: '12', gradient: 'from-green-500 to-emerald-500' },
  { path: '/teachers', icon: GraduationCap, label: "O'qituvchilar", badge: null, gradient: 'from-purple-500 to-violet-500' },
  { path: '/testimonials', icon: MessageSquare, label: 'Sharhlar', badge: '3', gradient: 'from-orange-500 to-red-500' },
  { path: '/courses', icon: BookOpen, label: 'Kurslar', badge: null, gradient: 'from-pink-500 to-rose-500' },
  { path: '/settings', icon: Settings, label: 'Sozlamalar', badge: null, gradient: 'from-gray-500 to-slate-500' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar - Reduced width */}
      <div className={`
        fixed left-0 top-0 h-full w-64 lg:w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200/50
        shadow-2xl shadow-indigo-500/10
        transform transition-all duration-300 ease-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        flex flex-col
        before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/80 before:to-white/40 before:-z-10
      `}>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <X size={20} />
        </Button>

        {/* Logo Section - Compact */}
        <div className="p-4 lg:p-5 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <GraduationCap className="text-white" size={22} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="text-white" size={8} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
                O'quv Markaz
              </h1>
              <p className="text-xs lg:text-sm text-gray-500 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* User Profile Card - Compact */}
        <div className="p-3 lg:p-4 border-b border-gray-200/50">
          <div className="relative p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/50 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10 lg:w-12 lg:h-12 ring-2 ring-white shadow-lg">
                  <AvatarImage 
                    src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1'} 
                    alt={user?.name} 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.phone}</p>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm text-xs px-2 py-1">
                <TrendingUp size={8} className="mr-1" />
                Admin
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Compact */}
        <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  group relative flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl transition-all duration-300
                  ${isActive 
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split('-')[1]}-500/25 scale-[1.02]` 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-[1.01]'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 lg:p-2 rounded-lg lg:rounded-xl transition-all duration-300 ${
                    ({ isActive }: { isActive: boolean }) => isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <span className="font-semibold text-sm lg:text-base truncate">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 animate-pulse">
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Section - Compact */}
        <div className="p-3 lg:p-4 border-t border-gray-200/50">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 rounded-xl lg:rounded-2xl py-2.5 lg:py-3 px-3 lg:px-4"
          >
            <div className="p-1.5 lg:p-2 rounded-lg lg:rounded-xl bg-gray-100 group-hover:bg-red-100 transition-colors mr-3">
              <LogOut size={18} />
            </div>
            <span className="font-semibold text-sm lg:text-base">Chiqish</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;