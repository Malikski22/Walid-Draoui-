import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const BusSearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [passengersCount, setPassengersCount] = useState(1);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format date to ISO string
    const formattedDate = departureDate.toISOString();
    
    // Navigate to search results page with query parameters
    navigate(`/bus/trips?originCity=${originCity}&destinationCity=${destinationCity}&departureDate=${formattedDate}&passengers=${passengersCount}`);
  };
  
  const cities = [
    { id: 'algiers', name: t('cities.algiers') },
    { id: 'oran', name: t('cities.oran') },
    { id: 'constantine', name: t('cities.constantine') },
    { id: 'annaba', name: t('cities.annaba') },
    { id: 'setif', name: t('cities.setif') },
    { id: 'batna', name: t('cities.batna') },
    { id: 'blida', name: t('cities.blida') },
    { id: 'sidi_bel_abbes', name: t('cities.sidi_bel_abbes') },
    { id: 'tlemcen', name: t('cities.tlemcen') },
    { id: 'biskra', name: t('cities.biskra') }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div 
        className="relative bg-center bg-cover h-80 flex items-center justify-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')` 
        }}
      >
        <div className="text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            حجز تذاكر الحافلات
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-xl text-white">
            ابحث عن رحلات الحافلات بين المدن الجزائرية واحجز تذاكرك بكل سهولة
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <label htmlFor="originCity" className="block text-sm font-medium text-gray-700 mb-1">
                مدينة الانطلاق
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="originCity"
                  name="originCity"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                >
                  <option value="">اختر مدينة الانطلاق</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <label htmlFor="destinationCity" className="block text-sm font-medium text-gray-700 mb-1">
                مدينة الوصول
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="destinationCity"
                  name="destinationCity"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                >
                  <option value="">اختر مدينة الوصول</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}
                      disabled={city.id === originCity} // Disable selecting same city
                    >
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ السفر
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <DatePicker
                  id="departureDate"
                  selected={departureDate}
                  onChange={date => setDepartureDate(date)}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="block w-full rounded-md border-0 py-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                عدد المسافرين
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="passengers"
                  name="passengers"
                  value={passengersCount}
                  onChange={(e) => setPassengersCount(parseInt(e.target.value))}
                  className="block w-full rounded-md border-0 py-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'مسافر' : 'مسافرين'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-transparent mb-1">
                بحث
              </label>
              <button
                type="submit"
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              >
                <TruckIcon className="h-5 w-5 ml-1" />
                بحث عن الرحلات
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-16 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">كيفية حجز تذكرة الحافلة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">ابحث عن رحلتك</h3>
              <p className="text-gray-600">حدد مدينة الانطلاق والوصول وتاريخ السفر وعدد المسافرين</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">اختر الرحلة المناسبة</h3>
              <p className="text-gray-600">اختر من بين الرحلات المتاحة حسب الوقت والسعر وشركة النقل</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">اختر مقعدك وادفع</h3>
              <p className="text-gray-600">اختر المقعد المفضل لديك وأكمل عملية الحجز بسهولة</p>
            </div>
          </div>
        </div>
        
        <div className="my-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">أشهر الوجهات</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { from: 'algiers', to: 'oran', image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWxnZXJpYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
              { from: 'constantine', to: 'algiers', image: 'https://images.unsplash.com/photo-1595536446891-b106e954b66b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
              { from: 'oran', to: 'annaba', image: 'https://images.unsplash.com/photo-1574270981993-db3d9554ae29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80' },
              { from: 'batna', to: 'setif', image: 'https://images.unsplash.com/photo-1565686160082-4e2a57b73bdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80' }
            ].map((route, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <img 
                  src={route.image} 
                  alt={`${route.from} to ${route.to}`} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 right-0 p-4 text-right">
                  <h3 className="text-lg font-bold text-white">
                    {t(`cities.${route.from}`)} - {t(`cities.${route.to}`)}
                  </h3>
                  <button 
                    onClick={() => {
                      setOriginCity(route.from);
                      setDestinationCity(route.to);
                      // Scroll to search form
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-2 text-blue-300 hover:text-blue-200 text-sm flex items-center justify-end"
                  >
                    <BusIcon className="h-4 w-4 ml-1" />
                    البحث عن رحلات
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusSearchPage;
