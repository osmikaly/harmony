import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

type PilgrimFormProps = {
  initialData?: Partial<{
    id: number;
    groupId: number;
    nameAr: string;
    nameEn: string;
    gender: 'male' | 'female';
    birthDate: string;
    birthCity: string;
    birthCountry: string;
    profession: string;
    status: 'active' | 'inactive';
    passportNumber: string;
    passportType: string;
    passportIssueDate: string;
    passportExpiryDate: string;
    passportIssueCity: string;
    passportIssueCountry: string;
    hasVisa: boolean;
    visaType: string;
    visaDetails: string;
    roomType: string;
    roomDetails: string;
    advancePayment: string;
    airline: string;
    airlineDetails: string;
    referredBy: string;
    referredByDetails: string;
    agent: string;
    agentDetails: string;
    photo?: string;
    visaScan?: string;
    hasTransport: boolean;
    transportType: string;
    transportDetails: string;
    hotelName: string;
    hotelDetails: string;
  }>;
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
    passportNumber: initialData?.passportNumber || '',
    passportType: initialData?.passportType || 'regular',
    passportIssueDate: initialData?.passportIssueDate || '',
    passportExpiryDate: initialData?.passportExpiryDate || '',
    passportIssueCity: initialData?.passportIssueCity || '',
    passportIssueCountry: initialData?.passportIssueCountry || '',
    hasVisa: initialData?.hasVisa === true,
    visaType: initialData?.visaType || '',
    visaDetails: initialData?.visaDetails || '',
    roomType: initialData?.roomType || '',
    roomDetails: initialData?.roomDetails || '',
    advancePayment: initialData?.advancePayment || '',
    airline: initialData?.airline || '',
    airlineDetails: initialData?.airlineDetails || '',
    referredBy: initialData?.referredBy || '',
    referredByDetails: initialData?.referredByDetails || '',
    agent: initialData?.agent || '',
    agentDetails: initialData?.agentDetails || '',
    photo: initialData?.photo || '',
    visaScan: initialData?.visaScan || '',
    hasTransport: initialData?.hasTransport === true,
    transportType: initialData?.transportType || '',
    transportDetails: initialData?.transportDetails || '',
    hotelName: initialData?.hotelName || '',
    hotelDetails: initialData?.hotelDetails || '',
  });

  // ... existing code ...
  
  return (
    <Tabs defaultValue="passport" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="passport">
          {language === 'en' ? 'Passport' : 'جواز سفر'}
              </TabsTrigger>
              <TabsTrigger value="travel">
          {language === 'en' ? 'Travel' : 'الرحلة'}
              </TabsTrigger>
              <TabsTrigger value="accommodation">
          {language === 'en' ? 'Accommodation' : 'الإقامة'}
              </TabsTrigger>
            </TabsList>
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
                <SelectValue placeholder={language === 'en' ? 'Select passport type' : 'اختر نوع الجواز'} />
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
          <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="visaType">
                    {language === 'en' ? 'Visa Type' : 'نوع التأشيرة'}
                  </Label>
                  <Select
                    value={formData.visaType}
                    onValueChange={(value) => handleSelectChange('visaType', value)}
                  >
                    <SelectTrigger className="pilgrim-input">
                  <SelectValue placeholder={language === 'en' ? 'Select visa type' : 'اختر نوع التأشيرة'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="external">
                        {language === 'en' ? 'External' : 'خارجية'}
                      </SelectItem>
                      <SelectItem value="internal">
                        {language === 'en' ? 'Internal' : 'داخلية'}
                      </SelectItem>
                      <SelectItem value="hajj">
                        {language === 'en' ? 'Hajj' : 'حج'}
                      </SelectItem>
                      <SelectItem value="umrah">
                        {language === 'en' ? 'Umrah' : 'عمرة'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visaDetails">
                {language === 'en' ? 'Additional Visa Details' : 'تفاصيل إضافية للتأشيرة'}
              </Label>
              <Textarea
                id="visaDetails"
                name="visaDetails"
                value={formData.visaDetails}
                onChange={handleChange}
                placeholder={language === 'en' ? 'Enter any additional visa details' : 'أدخل أي تفاصيل إضافية للتأشيرة'}
                className="pilgrim-input"
              />
            </div>
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transportType">
                {language === 'en' ? 'Transport Type' : 'نوع المواصلات'}
              </Label>
              <Select
                value={formData.transportType}
                onValueChange={(value) => handleSelectChange('transportType', value)}
              >
                <SelectTrigger className="pilgrim-input">
                  <SelectValue placeholder={language === 'en' ? 'Select transport type' : 'اختر نوع المواصلات'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bus">
                    {language === 'en' ? 'Bus' : 'حافلة'}
                  </SelectItem>
                  <SelectItem value="car">
                    {language === 'en' ? 'Car' : 'سيارة'}
                  </SelectItem>
                  <SelectItem value="van">
                    {language === 'en' ? 'Van' : 'فان'}
                  </SelectItem>
                  <SelectItem value="other">
                    {language === 'en' ? 'Other' : 'أخرى'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.transportType === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="transportDetails">
                  {language === 'en' ? 'Transport Details' : 'تفاصيل المواصلات'}
                </Label>
                <Input
                  id="transportDetails"
                  name="transportDetails"
                  value={formData.transportDetails}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'Enter transport details' : 'أدخل تفاصيل المواصلات'}
                  className="pilgrim-input"
                />
              </div>
            )}
          </div>
        )}
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="referredBy">
                    {language === 'en' ? 'Referred By' : 'من طرف'}
                  </Label>
            <Select
                    value={formData.referredBy}
              onValueChange={(value) => handleSelectChange('referredBy', value)}
            >
              <SelectTrigger className="pilgrim-input">
                <SelectValue placeholder={language === 'en' ? 'Select referral type' : 'اختر نوع الإحالة'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {language === 'en' ? '-- Select referral type --' : '-- اختر نوع الإحالة --'}
                </SelectItem>
                <SelectItem value="friend">
                  {language === 'en' ? 'Friend' : 'صديق'}
                </SelectItem>
                <SelectItem value="family">
                  {language === 'en' ? 'Family' : 'عائلة'}
                </SelectItem>
                <SelectItem value="agent">
                  {language === 'en' ? 'Agent' : 'وكيل'}
                </SelectItem>
                <SelectItem value="other">
                  {language === 'en' ? 'Other' : 'أخرى'}
                </SelectItem>
              </SelectContent>
            </Select>
                </div>
                
          {formData.referredBy === 'other' && (
                <div className="space-y-2">
              <Label htmlFor="referredByDetails">
                {language === 'en' ? 'Referral Details' : 'تفاصيل الإحالة'}
                  </Label>
                  <Input
                id="referredByDetails"
                name="referredByDetails"
                value={formData.referredByDetails}
                    onChange={handleChange}
                placeholder={language === 'en' ? 'Enter referral details' : 'أدخل تفاصيل الإحالة'}
                    className="pilgrim-input"
                  />
                </div>
          )}
              </div>
            </TabsContent>
            
            <TabsContent value="accommodation" className="pt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="hotelName">
              {language === 'en' ? 'Hotel Name' : 'اسم الفندق'}
            </Label>
            <Select
              value={formData.hotelName}
              onValueChange={(value) => handleSelectChange('hotelName', value)}
            >
              <SelectTrigger className="pilgrim-input">
                <SelectValue placeholder={language === 'en' ? 'Select hotel' : 'اختر الفندق'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {language === 'en' ? '-- Select hotel --' : '-- اختر الفندق --'}
                </SelectItem>
                <SelectItem value="hilton">
                  {language === 'en' ? 'Hilton' : 'هيلتون'}
                </SelectItem>
                <SelectItem value="marriott">
                  {language === 'en' ? 'Marriott' : 'ماريوت'}
                </SelectItem>
                <SelectItem value="hyatt">
                  {language === 'en' ? 'Hyatt' : 'هيات'}
                </SelectItem>
                <SelectItem value="other">
                  {language === 'en' ? 'Other' : 'أخرى'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.hotelName === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="hotelDetails">
                {language === 'en' ? 'Hotel Details' : 'تفاصيل الفندق'}
              </Label>
              <Input
                id="hotelDetails"
                name="hotelDetails"
                value={formData.hotelDetails}
                onChange={handleChange}
                placeholder={language === 'en' ? 'Enter hotel name' : 'أدخل اسم الفندق'}
                className="pilgrim-input"
              />
            </div>
          )}
        </div>

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
                      <SelectItem value="single">
                        {language === 'en' ? 'Single' : 'فردية'}
                      </SelectItem>
                      <SelectItem value="double">
                        {language === 'en' ? 'Double' : 'مزدوجة'}
                      </SelectItem>
                      <SelectItem value="triple">
                        {language === 'en' ? 'Triple' : 'ثلاثية'}
                      </SelectItem>
                      <SelectItem value="quad">
                        {language === 'en' ? 'Quad' : 'رباعي'}
                      </SelectItem>
              <SelectItem value="other">
                {language === 'en' ? 'Other' : 'أخرى'}
              </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

        {formData.roomType === 'other' && (
          <div className="space-y-2">
            <Label htmlFor="roomDetails">
              {language === 'en' ? 'Room Details' : 'تفاصيل الغرفة'}
            </Label>
            <Input
              id="roomDetails"
              name="roomDetails"
              value={formData.roomDetails}
              onChange={handleChange}
              placeholder={language === 'en' ? 'Enter room details' : 'أدخل تفاصيل الغرفة'}
              className="pilgrim-input"
            />
          </div>
        )}
                
                <div className="space-y-2">
                  <Label htmlFor="advancePayment">
                    {language === 'en' ? 'Advance Payment' : 'الدفعة المقدمة'}
                  </Label>
                  <Input
                    id="advancePayment"
                    name="advancePayment"
                    value={formData.advancePayment}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter payment amount' : 'أدخل مبلغ الدفع'}
                    className="pilgrim-input"
                  />
              </div>
            </TabsContent>
          </Tabs>
  );
}; 