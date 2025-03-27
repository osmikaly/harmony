import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { LayoutDashboard, Users, UserPlus, FileX, AlertCircle } from 'lucide-react';
export const Sidebar: React.FC = () => {
  const {
    language
  } = useAppContext();
  const menuItems = [{
    name: language === 'en' ? 'Dashboard' : 'لوحة التحكم',
    path: '/',
    icon: <LayoutDashboard className="h-5 w-5" />
  }, {
    name: language === 'en' ? 'Groups' : 'المجموعات',
    path: '/groups',
    icon: <Users className="h-5 w-5" />
  }, {
    name: language === 'en' ? 'Pilgrims' : 'المعتمرين',
    path: '/pilgrims',
    icon: <UserPlus className="h-5 w-5" />
  }, {
    name: language === 'en' ? 'Pilgrims Without Visa' : 'المعتمرين بدون تأشيرة',
    path: '/pilgrims-without-visa',
    icon: <AlertCircle className="h-5 w-5" />
  }];
  return <aside className="hidden lg:flex w-64 flex-col border-r bg-sidebar/50 backdrop-blur-sm">
      <div className="h-16 shrink-0 border-b flex items-center justify-center">
        <h1 className="text-2xl font-bold text-primary">
          {language === 'en' ? 'HARMONY' : 'HARMONY'}
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => <NavLink key={item.path} to={item.path} className={({
        isActive
      }) => `flex items-center space-x-3 rtl:space-x-reverse px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}>
            {item.icon}
            <span>{item.name}</span>
          </NavLink>)}
      </nav>
      
    </aside>;
};