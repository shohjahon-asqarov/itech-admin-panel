import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Bell, Shield, User, Globe, Database, Mail, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    newLeads: true,
    courseEnrollments: true,
    testimonials: true,
    systemAlerts: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
    { id: 'security', label: 'Xavfsizlik', icon: Shield },
    { id: 'system', label: 'Tizim', icon: Database },
    { id: 'contact', label: 'Aloqa', icon: Mail },
  ];

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  // Profil formi uchun react-hook-form
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors, isSubmitting: isProfileSubmitting } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      role: 'Administrator',
      bio: user?.bio || '',
    }
  });

  const onProfileSubmit = (data: any) => {
    // Profil ma'lumotlarini saqlash logikasi shu yerda
    // Masalan: userService.updateProfile(data)
    alert('Profil ma’lumotlari saqlandi!');
  };

  // Xavfsizlik formi uchun react-hook-form
  const { register: registerSecurity, handleSubmit: handleSecuritySubmit, formState: { errors: securityErrors, isSubmitting: isSecuritySubmitting } } = useForm();

  const onSecuritySubmit = (data: any) => {
    // Parolni yangilash logikasi shu yerda
    alert('Parol yangilandi!');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <img
          src={user?.avatar}
          alt={user?.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
          <p className="text-gray-600">{user?.phone}</p>
          <Badge variant="secondary">Administrator</Badge>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleProfileSubmit(onProfileSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To'liq ism</label>
            <input
              type="text"
              {...registerProfile('name', { required: 'Ism majburiy' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {profileErrors.name && <span className="text-destructive text-xs">{profileErrors.name.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam</label>
            <input
              type="tel"
              {...registerProfile('phone', { required: 'Telefon raqam majburiy' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {profileErrors.phone && <span className="text-destructive text-xs">{profileErrors.phone.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...registerProfile('email', { required: 'Email majburiy' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {profileErrors.email && <span className="text-destructive text-xs">{profileErrors.email.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lavozim</label>
            <input
              type="text"
              {...registerProfile('role')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            rows={3}
            {...registerProfile('bio')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isProfileSubmitting}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={20} className="mr-2" />
          {isProfileSubmitting ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
        </button>
      </form>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bildirishnoma sozlamalari</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Yangi lidlar</h4>
              <p className="text-sm text-gray-600">Yangi lid kelganda bildirishnoma olish</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.newLeads}
                onChange={(e) => handleNotificationChange('newLeads', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Kurs ro'yxatdan o'tish</h4>
              <p className="text-sm text-gray-600">Yangi talaba ro'yxatdan o'tganda bildirishnoma olish</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.courseEnrollments}
                onChange={(e) => handleNotificationChange('courseEnrollments', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Yangi sharhlar</h4>
              <p className="text-sm text-gray-600">Yangi sharh kelib tushganda bildirishnoma olish</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.testimonials}
                onChange={(e) => handleNotificationChange('testimonials', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Tizim ogohlantirishlari</h4>
              <p className="text-sm text-gray-600">Tizim xatoliklari va ogohlantirishlari</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.systemAlerts}
                onChange={(e) => handleNotificationChange('systemAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Email bildirishnomalari</h4>
              <p className="text-sm text-gray-600">Email orqali bildirishnoma olish</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">SMS bildirishnomalari</h4>
              <p className="text-sm text-gray-600">SMS orqali bildirishnoma olish</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.smsNotifications}
                onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xavfsizlik sozlamalari</h3>

        <form className="space-y-4" onSubmit={handleSecuritySubmit(onSecuritySubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Joriy parol</label>
            <input
              type="password"
              {...registerSecurity('currentPassword', { required: 'Joriy parol majburiy' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Joriy parolni kiriting"
            />
            {securityErrors.currentPassword && <span className="text-destructive text-xs">{securityErrors.currentPassword.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yangi parol</label>
            <input
              type="password"
              {...registerSecurity('newPassword', { required: 'Yangi parol majburiy' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Yangi parolni kiriting"
            />
            {securityErrors.newPassword && <span className="text-destructive text-xs">{securityErrors.newPassword.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yangi parolni tasdiqlash</label>
            <input
              type="password"
              {...registerSecurity('confirmPassword', { required: 'Parolni tasdiqlash majburiy' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Yangi parolni qayta kiriting"
            />
            {securityErrors.confirmPassword && <span className="text-destructive text-xs">{securityErrors.confirmPassword.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSecuritySubmitting}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={20} className="mr-2" />
            {isSecuritySubmitting ? 'Saqlanmoqda...' : 'Parolni yangilash'}
          </button>
        </form>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Kirish tarixi</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Bugun, 14:30</p>
              <p className="text-sm text-gray-600">IP: 192.168.1.1 • Chrome Browser</p>
            </div>
            <Badge variant="default">Joriy sessiya</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Kecha, 09:15</p>
              <p className="text-sm text-gray-600">IP: 192.168.1.1 • Chrome Browser</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">2 kun oldin, 16:45</p>
              <p className="text-sm text-gray-600">IP: 192.168.1.1 • Safari Browser</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tizim ma'lumotlari</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Tizim versiyasi</h4>
            <p className="text-sm text-gray-600">v2.1.0</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">So'nggi yangilanish</h4>
            <p className="text-sm text-gray-600">15 Yanvar 2024</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Ma'lumotlar bazasi</h4>
            <p className="text-sm text-gray-600">PostgreSQL 14.2</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Server holati</h4>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <p className="text-sm text-green-600">Faol</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Backup sozlamalari</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">Avtomatik backup</h5>
              <p className="text-sm text-gray-600">Har kuni soat 02:00 da avtomatik backup yaratish</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">So'nggi backup</h5>
            <p className="text-sm text-gray-600 mb-3">Bugun, 02:00 • 145 MB</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Backup yaratish
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aloqa ma'lumotlari</h3>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">O'quv markaz nomi</label>
              <input
                type="text"
                defaultValue="O'quv Markaz"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam</label>
              <input
                type="tel"
                defaultValue="+998712345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                defaultValue="info@oquvmarkaz.uz"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Veb-sayt</label>
              <input
                type="url"
                defaultValue="https://oquvmarkaz.uz"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
            <textarea
              rows={2}
              defaultValue="Toshkent sh., Chilonzor t., Bunyodkor ko'ch., 123-uy"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ijtimoiy tarmoqlar</label>
            <div className="space-y-2">
              <input
                type="url"
                placeholder="Instagram URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="Telegram URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="Facebook URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={20} className="mr-2" />
            O'zgarishlarni saqlash
          </button>
        </form>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'security': return renderSecurityTab();
      case 'system': return renderSystemTab();
      case 'contact': return renderContactTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sozlamalar</h1>
        <p className="text-gray-600">Tizim va profil sozlamalarini boshqarish</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card className="p-6">
            {renderTabContent()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;