import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MagnifyingGlassIcon, CalendarIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';

const HotelSearch = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [city, setCity] = useState('');
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [guestsCount, setGuestsCount] = useState(2);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format dates to ISO strings
    const formattedCheckIn = checkInDate.toISOString();
    const formattedCheckOut = checkOutDate.toISOString();
    
    // Navigate to search results page with query parameters
    navigate(`/hotels?city=${city}&checkIn=${formattedCheckIn}&checkOut=${formattedCheckOut}&guests=${guestsCount}`);
  };
  
  const cities = [
    { id: 'algiers', name: t('cities.algiers') },
    { id: 'oran', name: t('cities.oran') },
    { id: 'constantine', name: t('cities.constantine') },
    { id: 'annaba', name: t('cities.annaba') },
    { id: 'setif', name: t('cities.setif') },
    { id: 'batna', name: t('cities.batna') },
    { id: 'blida', name: t('cities.blida') }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto -mt-16 relative z-20" dir="rtl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-1">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            {t('hotels.city')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="block w-full rounded-md border-0 py-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
            >
              <option value="">{t('hotels.city')}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
            {t('hotels.checkIn')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <DatePicker
              id="checkIn"
              selected={checkInDate}
              onChange={date => setCheckInDate(date)}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="block w-full rounded-md border-0 py-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
            {t('hotels.checkOut')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <DatePicker
              id="checkOut"
              selected={checkOutDate}
              onChange={date => setCheckOutDate(date)}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={new Date(checkInDate.getTime() + 86400000)} // +1 day
              dateFormat="dd/MM/yyyy"
              className="block w-full rounded-md border-0 py-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            {t('hotels.guests')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <UserGroupIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="guests"
              name="guests"
              value={guestsCount}
              onChange={(e) => setGuestsCount(parseInt(e.target.value))}
              className="block w-full rounded-md border-0 py-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'ضيف' : 'ضيوف'}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-transparent mb-1">
            {t('common.search')}
          </label>
          <button
            type="submit"
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            <MagnifyingGlassIcon className="h-5 w-5 ml-1" />
            {t('hotels.search')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelSearch;
