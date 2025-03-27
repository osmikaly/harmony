
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

type GroupFormProps = {
  initialData?: {
    id?: number;
    name: string;
    city: string;
    notes: string;
  };
};

export const GroupForm: React.FC<GroupFormProps> = ({ initialData }) => {
  const { addGroup, updateGroup, language } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    city: initialData?.city || '',
    notes: initialData?.notes || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.city) {
      toast.error(
        language === 'en'
          ? 'Please fill in all required fields'
          : 'يرجى ملء جميع الحقول المطلوبة'
      );
      return;
    }
    
    if (initialData?.id) {
      updateGroup(initialData.id, formData);
      toast.success(
        language === 'en'
          ? 'Group updated successfully'
          : 'تم تحديث المجموعة بنجاح'
      );
    } else {
      addGroup(formData);
      toast.success(
        language === 'en'
          ? 'Group added successfully'
          : 'تمت إضافة المجموعة بنجاح'
      );
    }
    
    navigate('/groups');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/groups')}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">
            {language === 'en' ? 'Back' : 'عودة'}
          </span>
        </Button>
        <h2 className="text-2xl font-bold">
          {initialData?.id
            ? language === 'en'
              ? 'Edit Group'
              : 'تعديل المجموعة'
            : language === 'en'
              ? 'New Group'
              : 'مجموعة جديدة'}
        </h2>
      </div>
      
      <div className="glass-card rounded-lg p-6 card-transition">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                {language === 'en' ? 'Group Name' : 'اسم المجموعة'} *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={language === 'en' ? 'Enter group name' : 'أدخل اسم المجموعة'}
                className="pilgrim-input"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">
                {language === 'en' ? 'City' : 'المدينة'} *
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder={language === 'en' ? 'Enter city' : 'أدخل المدينة'}
                className="pilgrim-input"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">
              {language === 'en' ? 'Notes' : 'ملاحظات'}
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder={language === 'en' ? 'Enter notes' : 'أدخل ملاحظات'}
              className="pilgrim-input min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/groups')}
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button type="submit" className="bg-primary">
              {initialData?.id
                ? language === 'en'
                  ? 'Update Group'
                  : 'تحديث المجموعة'
                : language === 'en'
                  ? 'Create Group'
                  : 'إنشاء المجموعة'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
