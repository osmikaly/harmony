import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type PilgrimFormData = {
  id?: number;
  groupId: number;
  nameAr: string;
  nameEn: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthCity: string;
  birthCountry: string;
  profession: string;
  status: 'active' | 'inactive';
  phoneNumber: string;
  email: string;
  passportNumber: string;
  passportType: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportIssueCity: string;
  passportIssueCountry: string;
  hasVisa: boolean;
  visaType: string;
  roomType: string;
  advancePayment: string;
  advancePaymentMethod: 'cash' | 'bank_transfer' | 'bank_check';
  receiptNumber: string;
  airline: string;
  referredBy: string;
  agent: string;
  photo?: string;
  visaScan?: string;
  hasTransport: boolean;
  transportType: string;
  hotelName: string;
  airlineDetails: string;
};

type PilgrimFormProps = {
  initialData?: Partial<PilgrimFormData>;
};

export const PilgrimForm: React.FC<PilgrimFormProps> = ({ initialData }) => {
  const { addPilgrim, updatePilgrim, groups, language } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const groupIdFromURL = searchParams.get('groupId');

  const [formData, setFormData] = useState({
    groupId: groupIdFromURL ? Number(groupIdFromURL) : initialData?.groupId || 0,
    nameAr: initialData?.nameAr || '',
    nameEn: initialData?.nameEn || '',
    gender: initialData?.gender || 'male',
    birthDate: initialData?.birthDate || '',
    birthCity: initialData?.birthCity || '',
    birthCountry: initialData?.birthCountry || '',
    profession: initialData?.profession || '',
    status: initialData?.status || 'active',
    phoneNumber: initialData?.phoneNumber || '',
    email: initialData?.email || '',
    passportNumber: initialData?.passportNumber || '',
    passportType: initialData?.passportType || 'regular',
    passportIssueDate: initialData?.passportIssueDate || '',
    passportExpiryDate: initialData?.passportExpiryDate || '',
    passportIssueCity: initialData?.passportIssueCity || '',
    passportIssueCountry: initialData?.passportIssueCountry || '',
    hasVisa: initialData?.hasVisa === true,
    visaType: initialData?.visaType || 'external',
    roomType: initialData?.roomType || 'quad',
    advancePayment: initialData?.advancePayment || '',
    advancePaymentMethod: initialData?.advancePaymentMethod || 'cash',
    receiptNumber: initialData?.receiptNumber || '',
    airline: initialData?.airline || 'none',
    referredBy: initialData?.referredBy || '',
    agent: initialData?.agent || '',
    photo: initialData?.photo || '',
    visaScan: initialData?.visaScan || '',
    hasTransport: initialData?.hasTransport === true,
    transportType: initialData?.transportType || '',
    hotelName: initialData?.hotelName || '',
    airlineDetails: initialData?.airlineDetails || '',
  });

  const [activeTab, setActiveTab] = useState('personal');

  const currentGroup = formData.groupId ? groups.find(g => g.id === formData.groupId) : null;

  const isComingFromGroupPage = !!groupIdFromURL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [field]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nameEn || !formData.nameAr || !formData.passportNumber) {
      toast.error(
        language === 'en'
          ? 'Please fill in all required fields'
          : 'يرجى ملء جميع الحقول المطلوبة'
      );
      return;
    }

    const dataToSubmit = {
      ...formData,
      hasVisa: formData.hasVisa === true
    };

    if (initialData?.id) {
      updatePilgrim(initialData.id, dataToSubmit);
      toast.success(
        language === 'en'
          ? 'Pilgrim updated successfully'
          : 'تم تحديث المعتمر بنجاح'
      );

      if (groupIdFromURL) {
        navigate(`/groups/${groupIdFromURL}`);
      } else {
        navigate('/pilgrims');
      }
    } else {
      addPilgrim(dataToSubmit as PilgrimFormData);
      toast.success(
        language === 'en'
          ? 'Pilgrim added successfully'
          : 'تمت إضافة المعتمر بنجاح'
      );

      if (groupIdFromURL) {
        navigate(`/groups/${groupIdFromURL}`);
      } else {
        navigate('/pilgrims');
      }
    }
  };

  const handleBackClick = () => {
    if (groupIdFromURL) {
      navigate(`/groups/${groupIdFromURL}`);
    } else {
      navigate('/pilgrims');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackClick}
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
              ? 'Edit Pilgrim'
              : 'تعديل المعتمر'
            : language === 'en'
              ? 'New Pilgrim'
              : 'معتمر جديد'}
        </h2>
        {isComingFromGroupPage && currentGroup && (
          <div className="text-sm text-muted-foreground">
            {language === 'en'
              ? `Adding to group: ${currentGroup.name}`
              : `إضافة إلى المجموعة: ${currentGroup.name}`}
          </div>
        )}
      </div>

      <div className="glass-card rounded-lg p-6 card-transition">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={activeTab} onValueChange={(value) => {
            console.log('Tab changed:', value);
            setActiveTab(value);
          }} className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="personal">
                {language === 'en' ? 'Personal Information' : 'المعلومات الشخصية'}
              </TabsTrigger>
              <TabsTrigger value="passport">
                {language === 'en' ? 'Passport Details' : 'معلومات الجواز'}
              </TabsTrigger>
              <TabsTrigger value="travel">
                {language === 'en' ? 'Travel Information' : 'معلومات السفر'}
              </TabsTrigger>
              <TabsTrigger value="accommodation">
                {language === 'en' ? 'Accommodation' : 'السكن والدفع'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="pt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {!isComingFromGroupPage ? (
                  <div className="space-y-2">
                    <Label htmlFor="groupId">
                      {language === 'en' ? 'Group' : 'المجموعة'}
                    </Label>
                    <Select
                      value={formData.groupId.toString()}
                      onValueChange={(value) => handleSelectChange('groupId', value)}
                    >
                      <SelectTrigger className="pilgrim-input">
                        <SelectValue placeholder={language === 'en' ? 'Select group' : 'اختر المجموعة'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">
                          {language === 'en' ? '-- No Group --' : '-- بدون مجموعة --'}
                        </SelectItem>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id.toString()}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="groupId">
                      {language === 'en' ? 'Group' : 'المجموعة'}
                    </Label>
                    <div className="px-3 py-2 rounded-md border bg-muted/50">
                      {currentGroup ? currentGroup.name : (language === 'en' ? '-- No Group --' : '-- بدون مجموعة --')}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="status">
                    {language === 'en' ? 'Status' : 'الحالة'}
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger className="pilgrim-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        {language === 'en' ? 'Active' : 'نشط'}
                      </SelectItem>
                      <SelectItem value="inactive">
                        {language === 'en' ? 'Inactive' : 'غير نشط'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nameEn">
                    {language === 'en' ? 'Latin Name' : 'الاسم باللاتينية'} *
                  </Label>
                  <Input
                    id="nameEn"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter name in Latin characters' : 'أدخل الاسم بالأحرف اللاتينية'}
                    className="pilgrim-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameAr">
                    {language === 'en' ? 'Arabic Name' : 'الاسم بالعربية'} *
                  </Label>
                  <Input
                    id="nameAr"
                    name="nameAr"
                    value={formData.nameAr}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter name in Arabic' : 'أدخل الاسم بالعربية'}
                    className="pilgrim-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gender">
                    {language === 'en' ? 'Gender' : 'الجنس'}
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger className="pilgrim-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">
                        {language === 'en' ? 'Male' : 'ذكر'}
                      </SelectItem>
                      <SelectItem value="female">
                        {language === 'en' ? 'Female' : 'أنثى'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">
                    {language === 'en' ? 'Profession' : 'المهنة'}
                  </Label>
                  <Input
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter profession' : 'أدخل المهنة'}
                    className="pilgrim-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter phone number' : 'أدخل رقم الهاتف'}
                    className="pilgrim-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter email' : 'أدخل البريد الإلكتروني'}
                    className="pilgrim-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    {language === 'en' ? 'Birth Date' : 'تاريخ الميلاد'}
                  </Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="pilgrim-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthCity">
                    {language === 'en' ? 'Birth City' : 'مدينة الميلاد'}
                  </Label>
                  <Input
                    id="birthCity"
                    name="birthCity"
                    value={formData.birthCity}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter birth city' : 'أدخل مدينة الميلاد'}
                    className="pilgrim-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthCountry">
                    {language === 'en' ? 'Birth Country' : 'دولة الميلاد'}
                  </Label>
                  <Input
                    id="birthCountry"
                    name="birthCountry"
                    value={formData.birthCountry}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter birth country' : 'أدخل دولة الميلاد'}
                    className="pilgrim-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="photo">
                    {language === 'en' ? 'Photo' : 'الصورة الشخصية'}
                  </Label>
                  <div className="flex flex-col items-center space-y-2">
                    {formData.photo && (
                      <div className="w-32 h-32 border rounded-md overflow-hidden">
                        <img
                          src={formData.photo}
                          alt="Pilgrim"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'photo')}
                      className="pilgrim-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visaScan">
                    {language === 'en' ? 'Visa Scan' : 'صورة الجواز (المسح الضوئي)'}
                  </Label>
                  <div className="flex flex-col items-center space-y-2">
                    {formData.visaScan && (
                      <div className="w-32 h-32 border rounded-md overflow-hidden">
                        <img
                          src={formData.visaScan}
                          alt="Visa Scan"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <Input
                      id="visaScan"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'visaScan')}
                      className="pilgrim-input"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="passport" className="pt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">
                    {language === 'en' ? 'Passport Number' : 'رقم الجواز'} *
                  </Label>
                  <Input
                    id="passportNumber"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter passport number' : 'أدخل رقم الجواز'}
                    className="pilgrim-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passportType">
                    {language === 'en' ? 'Passport Type' : 'نوع الجواز'}
                  </Label>
                  <Select
                    value={formData.passportType}
                    onValueChange={(value) => handleSelectChange('passportType', value)}
                  >
                    <SelectTrigger className="pilgrim-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">
                        {language === 'en' ? 'Regular' : 'عادي'}
                      </SelectItem>
                      <SelectItem value="diplomatic">
                        {language === 'en' ? 'Diplomatic' : 'دبلوماسي'}
                      </SelectItem>
                      <SelectItem value="special">
                        {language === 'en' ? 'Special' : 'خاص'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="passportIssueDate">
                    {language === 'en' ? 'Issue Date' : 'تاريخ إصدار الجواز'}
                  </Label>
                  <Input
                    id="passportIssueDate"
                    name="passportIssueDate"
                    type="date"
                    value={formData.passportIssueDate}
                    onChange={handleChange}
                    className="pilgrim-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passportExpiryDate">
                    {language === 'en' ? 'Expiry Date' : 'تاريخ انتهاء الجواز'}
                  </Label>
                  <Input
                    id="passportExpiryDate"
                    name="passportExpiryDate"
                    type="date"
                    value={formData.passportExpiryDate}
                    onChange={handleChange}
                    className="pilgrim-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="passportIssueCity">
                    {language === 'en' ? 'Issue City' : 'مدينة الإصدار'}
                  </Label>
                  <Input
                    id="passportIssueCity"
                    name="passportIssueCity"
                    value={formData.passportIssueCity}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter issue city' : 'أدخل مدينة الإصدار'}
                    className="pilgrim-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passportIssueCountry">
                    {language === 'en' ? 'Issue Country' : 'دولة الإصدار'}
                  </Label>
                  <Input
                    id="passportIssueCountry"
                    name="passportIssueCountry"
                    value={formData.passportIssueCountry}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter issue country' : 'أدخل دولة الإصدار'}
                    className="pilgrim-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id="hasVisa"
                    checked={formData.hasVisa}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('hasVisa', checked as boolean)
                    }
                  />
                  <Label htmlFor="hasVisa" className="text-sm font-normal">
                    {language === 'en' ? 'Has Visa' : 'لديه تأشيرة'}
                  </Label>
                </div>
              </div>

              {formData.hasVisa && (
                <div className="space-y-2">
                  <Label htmlFor="visaType">
                    {language === 'en' ? 'Visa Type' : 'نوع التأشيرة'}
                  </Label>
                  <Select
                    value={formData.visaType}
                    onValueChange={(value) => handleSelectChange('visaType', value)}
                  >
                    <SelectTrigger className="pilgrim-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="external">
                        {language === 'en' ? 'External' : 'خارجية'}
                      </SelectItem>
                      <SelectItem value="internal">
                        {language === 'en' ? 'Internal' : 'داخلية'}
                      </SelectItem>
                      <SelectItem value="other">
                        {language === 'en' ? 'Other' : 'أخرى'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>

            <TabsContent value="travel" className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="airline">
                  {language === 'en' ? 'Airline' : 'شركة الطيران'}
                </Label>
                <Select
                  value={formData.airline}
                  onValueChange={(value) => handleSelectChange('airline', value)}
                >
                  <SelectTrigger className="pilgrim-input">
                    <SelectValue placeholder={language === 'en' ? 'Select airline' : 'اختر شركة الطيران'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {language === 'en' ? '-- Select airline --' : '-- اختر شركة الطيران --'}
                    </SelectItem>
                    <SelectItem value="saudia">
                      {language === 'en' ? 'Saudia Airlines' : 'الخطوط السعودية'}
                    </SelectItem>
                    <SelectItem value="emirates">
                      {language === 'en' ? 'Emirates Airlines' : 'طيران الإمارات'}
                    </SelectItem>
                    <SelectItem value="etihad">
                      {language === 'en' ? 'Etihad Airways' : 'الاتحاد للطيران'}
                    </SelectItem>
                    <SelectItem value="qatar">
                      {language === 'en' ? 'Qatar Airways' : 'الخطوط القطرية'}
                    </SelectItem>
                    <SelectItem value="other">
                      {language === 'en' ? 'Other' : 'أخرى'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.airline === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="airlineDetails">
                    {language === 'en' ? 'Airline Details' : 'تفاصيل شركة الطيران'}
                  </Label>
                  <Input
                    id="airlineDetails"
                    name="airlineDetails"
                    value={formData.airlineDetails}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter airline name' : 'أدخل اسم شركة الطيران'}
                    className="pilgrim-input"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id="hasTransport"
                    checked={formData.hasTransport}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('hasTransport', checked as boolean)
                    }
                  />
                  <Label htmlFor="hasTransport" className="text-sm font-normal">
                    {language === 'en' ? 'Has Transport' : 'لديه مواصلات'}
                  </Label>
                </div>
              </div>

              {formData.hasTransport && (
                <div className="space-y-2">
                  <Label htmlFor="transportType">
                    {language === 'en' ? 'Transport Type' : 'نوع النقل'}
                  </Label>
                  <Input
                    id="transportType"
                    name="transportType"
                    value={formData.transportType}
                    onChange={handleChange}
                    className="pilgrim-input"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="referredBy">
                    {language === 'en' ? 'Referred By' : 'من طرف'}
                  </Label>
                  <Input
                    id="referredBy"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter referral' : 'أدخل الإحالة'}
                    className="pilgrim-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent">
                    {language === 'en' ? 'Agent' : 'وكيل'}
                  </Label>
                  <Input
                    id="agent"
                    name="agent"
                    value={formData.agent}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter agent' : 'أدخل الوكيل'}
                    className="pilgrim-input"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="accommodation" className="pt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="roomType">
                    {language === 'en' ? 'Room Type' : 'نوع الغرفة'}
                  </Label>
                  <Select
                    value={formData.roomType}
                    onValueChange={(value) => handleSelectChange('roomType', value)}
                  >
                    <SelectTrigger className="pilgrim-input">
                      <SelectValue placeholder={language === 'en' ? 'Select room type' : 'اختر نوع الغرفة'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">{language === 'en' ? 'Single' : 'غرفة مفردة'}</SelectItem>
                      <SelectItem value="double">{language === 'en' ? 'Double' : 'غرفة مزدوجة'}</SelectItem>
                      <SelectItem value="triple">{language === 'en' ? 'Triple' : 'غرفة ثلاثية'}</SelectItem>
                      <SelectItem value="quad">{language === 'en' ? 'Quad' : 'غرفة رباعية'}</SelectItem>
                      <SelectItem value="five">{language === 'en' ? 'Five' : 'غرفة خماسية'}</SelectItem>
                      <SelectItem value="six">{language === 'en' ? 'Six' : 'غرفة ستة'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotelName">
                    {language === 'en' ? 'Hotel Name' : 'اسم الفندق'}
                  </Label>
                  <Input
                    id="hotelName"
                    name="hotelName"
                    value={formData.hotelName}
                    onChange={handleChange}
                    className="pilgrim-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiptNumber">
                    {language === 'en' ? 'Receipt Number' : 'رقم الإيصال'}
                  </Label>
                  <Input
                    id="receiptNumber"
                    name="receiptNumber"
                    value={formData.receiptNumber}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter receipt number' : 'أدخل رقم الإيصال'}
                    className="pilgrim-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advancePayment">
                    {language === 'en' ? 'Advance Payment' : 'الدفع المقدم'}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="advancePayment"
                      name="advancePayment"
                      type="number"
                      value={formData.advancePayment}
                      onChange={handleChange}
                      className="pilgrim-input"
                    />
                    <Select
                      value={formData.advancePaymentMethod}
                      onValueChange={(value) => handleSelectChange('advancePaymentMethod', value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder={language === 'en' ? 'Payment Method' : 'طريقة الدفع'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">{language === 'en' ? 'Cash' : 'نقدي'}</SelectItem>
                        <SelectItem value="bank_transfer">{language === 'en' ? 'Bank Transfer' : 'تحويل بنكي'}</SelectItem>
                        <SelectItem value="bank_check">{language === 'en' ? 'Bank Check' : 'شيك بنكي'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackClick}
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button type="submit" className="bg-primary">
              {initialData?.id
                ? language === 'en'
                  ? 'Update Pilgrim'
                  : 'تحديث المعتمر'
                : language === 'en'
                  ? 'Add Pilgrim'
                  : 'إضافة معتمر'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
