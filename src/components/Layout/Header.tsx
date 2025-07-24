import React from 'react';
import { Menu, Bell, Search, User, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 px-4 lg:px-6 py-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-gray-100 rounded-xl"
          >
            <Menu size={20} />
          </Button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <Calendar size={14} />
              <p>
                {new Date().toLocaleDateString('uz-UZ', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Search - Hidden on mobile */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              type="text"
              placeholder="Qidirish..."
              className="pl-10 pr-4 w-48 xl:w-64 bg-gray-50/80 border-gray-200/50 rounded-xl focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-xl">
            <Bell size={18} />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white animate-pulse">
              3
            </Badge>
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 lg:space-x-3 pl-2 lg:pl-3 border-l border-gray-200">
            <Avatar className="w-8 h-8 lg:w-10 lg:h-10 ring-2 ring-gray-200 shadow-sm">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                {user?.name?.charAt(0) || <User size={14} />}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                {user?.role && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm border border-white/30 ${user.role === 'admin' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'}`}>
                    <User size={12} className="opacity-80" />
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;