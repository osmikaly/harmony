import React from 'react';
import { Sidebar } from './Sidebar';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { language, setLanguage } = useAppContext();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
    toast.success(language === 'en' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex w-full overflow-hidden bg-gradient-to-br from-background to-muted/50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 shrink-0 border-b bg-background/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8">
          <div className="text-2xl font-semibold text-primary">
            {language === 'en' ? 'HARMONY' : 'HARMONY'}
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-sm"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-destructive hover:text-destructive/90"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="page-transition">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
