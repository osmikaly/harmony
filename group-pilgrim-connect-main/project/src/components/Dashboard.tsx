import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, CalendarDays, Activity, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { pilgrims, groups, language } = useAppContext();
  const navigate = useNavigate();
  
  const stats = [
    {
      title: language === 'en' ? 'Total Pilgrims' : ' إجمالي المعتمر',
      value: pilgrims.length,
      icon: <UserPlus className="h-5 w-5" />,
      color: 'bg-pilgrim-blue',
      onClick: () => navigate('/pilgrims')
    },
    {
      title: language === 'en' ? 'Total Groups' : 'إجمالي المجموعات',
      value: groups.length,
      icon: <Users className="h-5 w-5" />,
      color: 'bg-pilgrim-green',
      onClick: () => navigate('/groups')
    },
    {
      title: language === 'en' ? 'Pilgrims Without Visa' : 'المعتمر بدون تأشيرة',
      value: pilgrims.filter(p => !p.hasVisa).length,
      icon: <FileX className="h-5 w-5" />,
      color: 'bg-pilgrim-purple',
      onClick: () => navigate('/pilgrims-without-visa')
    },
    {
      title: language === 'en' ? 'This Month' : 'هذا الشهر',
      value: pilgrims.filter(p => {
        const date = new Date(p.birthDate);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length,
      icon: <CalendarDays className="h-5 w-5" />,
      color: 'bg-pilgrim-yellow'
    },
  ];
  
  const recentPilgrims = pilgrims.slice(-5).reverse();
  const recentGroups = groups.slice(-5).reverse();
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">
          {language === 'en' ? 'Dashboard' : 'لوحة التحكم'}
        </h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Button asChild>
            <Link to="/pilgrims/new">
              {language === 'en' ? 'Add Pilgrim' : 'إضافة معتمر'}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/groups/new">
              {language === 'en' ? 'Add Group' : 'إضافة مجموعة'}
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 card-transition">
        {stats.map((stat, i) => (
          <Card 
            key={i} 
            className={`glass-card ${stat.onClick ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
            onClick={stat.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.color} p-2 rounded-full text-white`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 card-transition" style={{ animationDelay: '100ms' }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Recent Pilgrims' : 'آخر المعتمر'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPilgrims.length > 0 ? (
              <div className="space-y-4">
                {recentPilgrims.map((pilgrim) => (
                  <div key={pilgrim.id} className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {pilgrim.id}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{language === 'en' ? pilgrim.nameEn : pilgrim.nameAr}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' ? 'Passport: ' : 'جواز السفر: '}
                        {pilgrim.passportNumber}
                      </p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/pilgrims/${pilgrim.id}`}>
                        {language === 'en' ? 'View' : 'عرض'}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {language === 'en' ? 'No pilgrims added yet' : 'لم تتم إضافة معتمر بعد'}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Recent Groups' : 'آخر المجموعات'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentGroups.length > 0 ? (
              <div className="space-y-4">
                {recentGroups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {group.id}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' ? 'City: ' : 'المدينة: '}
                        {group.city}
                      </p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/groups/${group.id}`}>
                        {language === 'en' ? 'View' : 'عرض'}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {language === 'en' ? 'No groups added yet' : 'لم تتم إضافة مجموعات بعد'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
