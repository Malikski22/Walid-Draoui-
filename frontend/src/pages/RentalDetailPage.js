import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  HomeModernIcon,
  WifiIcon,
  TvIcon,
  HeartIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const RentalDetailPage = ({ user }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Sample rental data - in a real app, this would be fetched from an API
  const [rental, setRental] = useState({
    id: '1',
    title: 'شقة فخمة مطلة على البحر',
    type: 'apartment',
    city: 'algiers',
    area: 'باب الزوار',
    price: 8000,
    priceType: 'perNight', // 'perNight' or 'perMonth'
    bedrooms: 2,
    bathrooms: 1,
    size: 120, // m²
    maxGuests: 4,
    description: 'شقة جميلة ومجهزة بالكامل مع إطلالة رائعة على البحر في موقع مركزي بالجزائر العاصمة. تتكون من غرفتين، صالون كبير، مطبخ مجهز، حمام عصري، وشرفة تطل على البحر. تم تجديدها حديثًا وتأثيثها بأثاث راقي وعصري.\n\nالمنطقة هادئة وآمنة، قريبة من المواصلات والخدمات والمحلات التجارية. تبعد مسافة قصيرة سيرًا على الأقدام عن الشاطئ والكورنيش.',
    amenities: ['واي فاي', 'مكيف', 'مطبخ', 'غسالة', 'تلفزيون', 'شرفة', 'إطلالة على البحر', 'ثلاجة', 'موقف سيارات', 'سخان مياه'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
    ],
    rating: 4.8,
    reviewsCount: 24,
    owner: {
      name: 'محمد علي',
      phone: '+213555123456',
      email: 'owner@example.com',
      responseRate: 97,
      responseTime: 'في خلال ساعة'
    },
    location: {
      address: 'شارع البحر، باب الزوار، الجزائر العاصمة',
      latitude: 36.7213,
      longitude: 3.1746
    },
    policies: {
      minNights: 2,
      maxNights: 30,
      checkIn: '14:00',
      checkOut: '12:00',
      cancellation: 'مرنة - استرداد كامل المبلغ عند الإلغاء قبل 24 ساعة من موعد الوصول'
    }
  });
  
  // Booking state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + (rental.priceType === 'perNight' ? 86400000 * 3 : 86400000 * 30))); // 3 days or 30 days
  const [guests, setGuests] = useState(2);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  
  // Calculate duration and total price
  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return rental.priceType === 'perNight' ? diffDays : Math.ceil(diffDays / 30);
  };
  
  const calculateTotalPrice = () => {
    const duration = calculateDuration();
    return rental.price * duration;
  };
  
  const handleBooking = () => {
    if (!user) {
      navigate('/login', { state: { from: `/rentals/${rental.id}` } });
      return;
    }
    
    // Validate dates
    if (!startDate || !endDate) {
      alert('الرجاء تحديد تواريخ الإقامة');
      return;
    }
    
    // Validate guests
    if (!guests || guests < 1) {
      alert('الرجاء تحديد عدد الضيوف');
      return;
    }
    
    // Pass data to payment page
    navigate('/payment', {
      state: {
        booking: {
          id: `RENTAL-${Date.now()}`,
          totalPrice: calculateTotalPrice(),
          type: 'rental'
        }
      }
    });
  };
  
  const handleContactOwner = (e) => {
    e.preventDefault();
    // In a real app, this would send the message to the owner
    alert('تم إرسال رسالتك إلى المالك وسيتواصل معك قريبًا');
    setMessage('');
    setShowContactForm(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50" dir={t('common.direction', { defaultValue: 'rtl' })}>
      {/* Image Gallery */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-80 md:h-96 rounded-lg overflow-hidden">
            <img 
              src={rental.images[activeImageIndex]} 
              alt={rental.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {rental.images.slice(1, 5).map((image, index) => (
              <div 
                key={index}
                className="h-40 md:h-[188px] rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setActiveImageIndex(index + 1)}
              >
                <img 
                  src={image}
                  alt={`${rental.title} - ${index + 2}`}
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{rental.title}</h1>
                  <p className="flex items-center text-gray-600 mt-2">
                    <MapPinIcon className="h-5 w-5 ml-1" />
                    {t(`cities.${rental.city}`)}, {rental.area}
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`h-5 w-5 ${i < Math.floor(rental.rating) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                      <span className="text-gray-600 mr-1">({rental.reviewsCount})</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-gray-100">
                  <HeartIcon className="h-6 w-6" />
                </button>
              </div>
              
              {/* Property Details */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center text-gray-700">
                  <BuildingOfficeIcon className="h-5 w-5 ml-2 text-blue-700" />
                  <div>
                    <div className="text-sm text-gray-500">غرف النوم</div>
                    <div className="font-medium">{rental.bedrooms}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <HomeModernIcon className="h-5 w-5 ml-2 text-blue-700" />
                  <div>
                    <div className="text-sm text-gray-500">الحمامات</div>
                    <div className="font-medium">{rental.bathrooms}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <UserGroupIcon className="h-5 w-5 ml-2 text-blue-700" />
                  <div>
                    <div className="text-sm text-gray-500">الضيوف</div>
                    <div className="font-medium">{rental.maxGuests}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">المساحة</div>
                    <div className="font-medium">{rental.size} م²</div>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">وصف العقار</h2>
                <div className="text-gray-700 whitespace-pre-line">{rental.description}</div>
              </div>
              
              {/* Amenities */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">المرافق والخدمات</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {rental.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      {amenity.includes('واي فاي') ? (
                        <WifiIcon className="h-5 w-5 ml-2 text-blue-700" />
                      ) : amenity.includes('تلفزيون') ? (
                        <TvIcon className="h-5 w-5 ml-2 text-blue-700" />
                      ) : (
                        <svg className="h-5 w-5 ml-2 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Location */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">الموقع</h2>
                <p className="text-gray-700 mb-4">{rental.location.address}</p>
                {/* Placeholder for map */}
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">خريطة الموقع</p>
                </div>
              </div>
              
              {/* Policies */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">قواعد وسياسات الإقامة</h2>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-1/3 text-gray-600">تسجيل الوصول</div>
                    <div>{rental.policies.checkIn}</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/3 text-gray-600">تسجيل المغادرة</div>
                    <div>{rental.policies.checkOut}</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/3 text-gray-600">الحد الأدنى للإقامة</div>
                    <div>{rental.policies.minNights} ليالي</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/3 text-gray-600">الحد الأقصى للإقامة</div>
                    <div>{rental.policies.maxNights} ليلة</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/3 text-gray-600">سياسة الإلغاء</div>
                    <div>{rental.policies.cancellation}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex justify-between items-start mb-6">
                <div className="text-2xl font-bold text-blue-700">
                  {rental.price.toLocaleString()} دج
                </div>
                <div className="text-gray-600">
                  / {t(`rentals.${rental.priceType}`)}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التواريخ
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        dateFormat="dd/MM/yyyy"
                        className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عدد الضيوف
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Array.from({ length: rental.maxGuests }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'ضيف' : 'ضيوف'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <div>{rental.price.toLocaleString()} دج × {calculateDuration()} {rental.priceType === 'perNight' ? 'ليلة' : 'شهر'}</div>
                    <div>{calculateTotalPrice().toLocaleString()} دج</div>
                  </div>
                  <div className="flex justify-between font-bold pt-4 border-t border-gray-200">
                    <div>المجموع</div>
                    <div>{calculateTotalPrice().toLocaleString()} دج</div>
                  </div>
                </div>
                
                <button
                  onClick={handleBooking}
                  className="w-full bg-blue-700 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-800"
                >
                  {t('rentals.bookNow')}
                </button>
                
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full bg-white border border-blue-700 text-blue-700 py-3 px-4 rounded-md font-medium hover:bg-blue-50"
                >
                  {t('rentals.contactOwner')}
                </button>
              </div>
              
              {/* Contact Form */}
              {showContactForm && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">تواصل مع المالك</h3>
                  <form onSubmit={handleContactOwner}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الرسالة
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="4"
                        required
                        className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="اكتب رسالتك هنا..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-700 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-800"
                    >
                      إرسال
                    </button>
                  </form>
                </div>
              )}
              
              {/* Owner Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">معلومات المالك</h3>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-lg font-bold ml-3">
                    {rental.owner.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{rental.owner.name}</div>
                    <div className="text-sm text-gray-500">
                      معدل الرد: {rental.owner.responseRate}% · {rental.owner.responseTime}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <PhoneIcon className="h-5 w-5 ml-2 text-blue-700" />
                    {rental.owner.phone}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <EnvelopeIcon className="h-5 w-5 ml-2 text-blue-700" />
                    {rental.owner.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetailPage;
