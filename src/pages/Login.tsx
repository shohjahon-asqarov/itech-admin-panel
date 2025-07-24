import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, GraduationCap, Eye, EyeOff, ArrowRight, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>();
  const [showPassword, setShowPassword] = React.useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: { email: string; password: string }) => {
    const success = await login(data.email, data.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a1c4fd] via-[#c2e9fb] to-[#fbc2eb] p-4">
      <div className="w-full max-w-md relative">
        {/* Glassmorphism background blob */}
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-300/20 rounded-full blur-3xl z-0 animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-gradient-to-tr from-purple-400/30 via-blue-300/20 to-pink-400/20 rounded-full blur-3xl z-0 animate-pulse" />
        {/* Logo & Title */}
        <div className="relative z-10 text-center mb-8 select-none">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl mb-4 shadow-2xl shadow-blue-400/30 border-4 border-white/30 backdrop-blur-xl animate-fade-in">
            <GraduationCap className="text-white drop-shadow-lg" size={40} />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 tracking-tight drop-shadow-lg animate-fade-in">
            iTech academy
          </h1>
          <p className="text-base text-gray-700/80 font-medium animate-fade-in">Admin panelga xush kelibsiz</p>
        </div>
        {/* Login Card */}
        <Card className="relative z-10 shadow-2xl border-0 bg-white/30 backdrop-blur-2xl ring-1 ring-white/40 rounded-3xl overflow-hidden animate-fade-in">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900/90">Kirish</CardTitle>
            <CardDescription className="text-center text-gray-700/70">
              Hisobingizga kirish uchun ma'lumotlaringizni kiriting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-800">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400/80" size={22} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-12 h-12 bg-white/60 border-0 focus:bg-white/90 transition-colors rounded-xl shadow-inner ring-1 ring-blue-200/30 focus:ring-2 focus:ring-blue-400/40"
                    {...register('email', { required: 'Email majburiy' })}
                    autoComplete="username"
                  />
                </div>
                {errors.email && (
                  <span className="text-destructive text-xs">{errors.email.message}</span>
                )}
              </div>
              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-800">Parol</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400/80" size={22} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Parolni kiriting"
                    className="pl-12 pr-12 h-12 bg-white/60 border-0 focus:bg-white/90 transition-colors rounded-xl shadow-inner ring-1 ring-purple-200/30 focus:ring-2 focus:ring-purple-400/40"
                    {...register('password', { required: 'Parol majburiy' })}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 text-blue-500/80 hover:bg-blue-100/40"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
                {errors.password && (
                  <span className="text-destructive text-xs">{errors.password.message}</span>
                )}
              </div>
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-semibold shadow-xl rounded-2xl transition-all duration-200 tracking-wide text-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Kuting...</span>
                  </>
                ) : (
                  <>
                    <span>Kirish</span>
                    <ArrowRight size={22} />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Footer */}
        <div className="relative z-10 text-center mt-8">
          <p className="text-sm text-gray-700/70 font-medium">
            © 2024 iTech academy. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;