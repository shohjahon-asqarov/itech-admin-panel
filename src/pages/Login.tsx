import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, GraduationCap, Eye, EyeOff, ArrowRight, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLogin } from '@/hooks/useLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>();
  const [showPassword, setShowPassword] = React.useState(false);
  const { login: legacyLogin } = useAuth();
  const { mutate: login, isLoading, error: loginError } = useLogin();
  const navigate = useNavigate();

  const onSubmit = (data: { email: string; password: string }) => {
    login(data, {
      onSuccess: (data) => {
        if (data?.token && data?.user) {
          localStorage.setItem('admin_token', data.token);
          localStorage.setItem('admin_user', JSON.stringify(data.user));
          navigate('/dashboard');
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            O'quv Markaz
          </h1>
          <p className="text-muted-foreground">Admin panelga xush kelibsiz</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Kirish</CardTitle>
            <CardDescription className="text-center">
              Hisobingizga kirish uchun ma'lumotlaringizni kiriting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-12 h-12 bg-muted/50 border-0 focus:bg-white transition-colors"
                    {...register('email', { required: 'Email majburiy' })}
                  />
                </div>
                {errors.email && (
                  <span className="text-destructive text-xs">{errors.email.message}</span>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Parol
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Parolni kiriting"
                    className="pl-12 pr-12 h-12 bg-muted/50 border-0 focus:bg-white transition-colors"
                    {...register('password', { required: 'Parol majburiy' })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
                {errors.password && (
                  <span className="text-destructive text-xs">{errors.password.message}</span>
                )}
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-sm font-medium">{loginError.message || loginError.toString()}</p>
                </div>
              )}

              {/* Demo Credentials */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm font-medium mb-2">Demo kirish ma'lumotlari:</p>
                <div className="space-y-1">
                  <p className="text-blue-600 text-sm">📧 Email: admin@example.com</p>
                  <p className="text-blue-600 text-sm">🔒 Parol: admin123</p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg transition-all duration-200"
              >
                {(isSubmitting || isLoading) ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Kuting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Kirish</span>
                    <ArrowRight size={20} />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            © 2024 O'quv Markaz. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;