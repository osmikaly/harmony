import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    // TODO: Implement password reset flow
    toast.info(language === 'en' 
      ? 'Password reset functionality coming soon' 
      : 'سيتم إضافة وظيفة إعادة تعيين كلمة المرور قريباً'
    );
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="mr-2 h-6 w-6" />
          {language === 'en' ? 'Nusuk Hajj Management' : 'نُسُك إدارة الحج'}
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              {language === 'en' 
                ? 'Streamline your Hajj management process with our comprehensive solution.'
                : 'بسط عملية إدارة الحج باستخدام حلنا الشامل.'}
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                {language === 'en' ? 'Welcome back' : 'مرحباً بعودتك'}
              </CardTitle>
              <CardDescription className="text-center">
                {language === 'en' 
                  ? 'Enter your credentials to access your account'
                  : 'أدخل بيانات اعتمادك للوصول إلى حسابك'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">
                      {language === 'en' ? 'Username' : 'اسم المستخدم'}
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder={language === 'en' ? 'Enter your username' : 'أدخل اسم المستخدم'}
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">
                      {language === 'en' ? 'Password' : 'كلمة المرور'}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={language === 'en' ? 'Enter your password' : 'أدخل كلمة المرور'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                      }
                    />
                    <Label
                      htmlFor="rememberMe"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {language === 'en' ? 'Remember me' : 'تذكرني'}
                    </Label>
                  </div>
                </div>
                <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {language === 'en' ? 'Sign in' : 'تسجيل الدخول'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                variant="link"
                className="px-0 font-normal"
                onClick={handleResetPassword}
                disabled={isLoading}
              >
                {language === 'en' 
                  ? 'Forgot your password?' 
                  : 'نسيت كلمة المرور؟'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}; 