import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
  HomeModernIcon,
  BuildingOfficeIcon,
  AdjustmentsHorizontalIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';

const RentalsPage = () => {
  const { t } = useTranslation();
  
  // Search form state
  const [searchParams, setSearchParams] = useState({
    city: '',
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 86400000 * 7), // +7 days
    guests: 2,
    type: 'all', // 'all', 'apartment', 'villa'
    minPrice: 0,
    maxPrice: 50000,
    bedrooms: 0
  });
  
  // Toggle filters on mobile
  const [showFilters, setShowFilters] = useState(false);
  
  // Sample rentals data
  const [rentals, setRentals] = useState([
    {
      id: '1',
      title: 'شقة فخمة مطلة على البحر',
      type: 'apartment',
      city: 'algiers',
      area: 'باب الزوار',
      price: 8000,
      priceType: 'perNight', // 'perNight' or 'perMonth'
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      description: 'شقة جميلة ومجهزة بالكامل مع إطلالة رائعة على البحر في موقع مركزي بالجزائر العاصمة',
      amenities: ['واي فاي', 'مكيف', 'مطبخ', 'غسالة', 'تلفزيون'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
      ],
      rating: 4.8,
      reviewsCount: 24
    },
    {
      id: '2',
      title: 'فيلا فاخرة مع مسبح خاص',
      type: 'villa',
      city: 'oran',
      area: 'عين الترك',
      price: 20000,
      priceType: 'perNight',
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      description: 'فيلا راقية ومجهزة بالكامل مع مسبح خاص وحديقة جميلة، قريبة من الشاطئ',
      amenities: ['واي فاي', 'مكيف', 'مطبخ', 'مسبح', 'موقف سيارات', 'شواء'],
      images: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
      ],
      rating: 4.9,
      reviewsCount: 15
    },
    {
      id: '3',
      title: 'شقة عائلية في وسط المدينة',
      type: 'apartment',
      city: 'constantine',
      area: 'سيدي مبروك',
      price: 35000,
      priceType: 'perMonth',
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 5,
      description: 'شقة واسعة ومريحة في موقع مركزي، مناسبة للعائلات وإقامة طويلة المدى',
      amenities: ['واي فاي', 'مكيف', 'مطبخ', 'غسالة', 'تلفزيون', 'شرفة'],
      images: [
        'https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
      ],
      rating: 4.6,
      reviewsCount: 19
    },
    {
      id: '4',
      title: 'فيلا ريفية هادئة',
      type: 'villa',
      city: 'annaba',
      area: 'سرايدي',
      price: 15000,
      priceType: 'perNight',
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      description: 'فيلا جميلة في منطقة هادئة محاطة بالطبيعة، مثالية للراحة والاسترخاء',
      amenities: ['واي فاي', 'مكيف', 'مطبخ', 'موقف سيارات', 'حديقة', 'اطلالة على الجبل'],
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
      ],
      rating: 4.7,
      reviewsCount: 12
    },
    {
      id: '5',
      title: 'استوديو مودرن قرب الجامعة',
      type: 'apartment',
      city: 'algiers',
      area: 'بن عكنون',
      price: 25000,
      priceType: 'perMonth',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      description: 'استوديو عصري ومجهز بالكامل، قريب من الجامعة والمواصلات العامة',
      amenities: ['واي فاي', 'مكيف', 'مطبخ صغير', 'غسالة', 'تلفزيون'],
      images: [
        'https://images.unsplash.com/photo-1630699144867-37acec97df5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0dWRpbyUyMGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHN0dWRpbyUyMGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
      ],
      rating: 4.4,
      reviewsCount: 8
    }
  ]);
  
  // Cities list
  const cities = [
    { id: 'algiers', name: t('cities.algiers') },
    { id: 'oran', name: t('cities.oran') },
    { id: 'constantine', name: t('cities.constantine') },
    { id: 'annaba', name: t('cities.annaba') },
    { id: 'setif', name: t('cities.setif') },
    { id: 'batna', name: t('cities.batna') },
    { id: 'blida', name: t('cities.blida') }
  ];
  
  // Handle search form changes
  const handleSearchChange = (e) => {
    const { name, value, type } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };
  
  // Handle date changes
  const handleDateChange = (name, date) => {
    setSearchParams({
      ...searchParams,
      [name]: date
    });
  };
  
  // Apply filters to rentals
  const filteredRentals = rentals.filter(rental => {
    // Filter by city
    if (searchParams.city && rental.city !== searchParams.city) {
      return false;
    }
    
    // Filter by property type
    if (searchParams.type !== 'all' && rental.type !== searchParams.type) {
      return false;
    }
    
    // Filter by price
    if (rental.price < searchParams.minPrice || rental.price > searchParams.maxPrice) {
      return false;
    }
    
    // Filter by bedrooms
    if (searchParams.bedrooms > 0 && rental.bedrooms < searchParams.bedrooms) {
      return false;
    }
    
    // Filter by guests
    if (rental.maxGuests < searchParams.guests) {
      return false;
    }
    
    return true;
  });
  
  // Rental property card component
  const RentalCard = ({ rental }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Property Image */}
        <div className="relative">
          <img 
            src={rental.images[0]} 
            alt={rental.title} 
            className="w-full h-48 object-cover"
          />
          <button className="absolute top-2 left-2 p-1.5 bg-white rounded-full text-gray-700 hover:text-red-500">
            <HeartIcon className="h-5 w-5" />
          </button>
          <span className="absolute top-2 right-2 bg-blue-700 text-white text-xs px-2 py-1 rounded">
            {rental.type === 'apartment' ? t('rentals.apartments') : t('rentals.villas')}
          </span>
        </div>
        
        {/* Property Details */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{rental.title}</h3>
              <p className="text-gray-600 text-sm flex items-center mt-1">
                <MapPinIcon className="h-4 w-4 ml-1" />
                {t(`cities.${rental.city}`)}, {rental.area}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-700">
                {rental.price.toLocaleString()} دج
              </div>
              <p className="text-xs text-gray-500">
                / {t(`rentals.${rental.priceType}`)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center mt-3 space-x-4 space-x-reverse">
            <div className="flex items-center text-gray-600 text-sm">
              <BuildingOfficeIcon className="h-4 w-4 ml-1" />
              {rental.bedrooms} غرف
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <HomeModernIcon className="h-4 w-4 ml-1" />
              {rental.bathrooms} حمام
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <UserGroupIcon className="h-4 w-4 ml-1" />
              {rental.maxGuests} أشخاص
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap">
            {rental.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded m-1">
                {amenity}
              </span>
            ))}
            {rental.amenities.length > 3 && (
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded m-1">
                +{rental.amenities.length - 3}
              </span>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-yellow-500 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`h-4 w-4 ${i < Math.floor(rental.rating) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-600 mr-1">({rental.reviewsCount})</span>
              </div>
            </div>
            <Link
              to={`/rentals/${rental.id}`}
              className="text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              {t('hotels.viewDetails')}
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50" dir={t('common.direction', { defaultValue: 'rtl' })}>
      <div className="bg-blue-700 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            {t('rentals.title')}
          </h1>
          <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
            ابحث عن شقق وفيلات للإيجار في أنحاء الجزائر، حجز يومي أو شهري حسب احتياجاتك
          </p>
        </div>
      </div>
      
      {/* Search Form */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-10 relative">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="md:flex md:items-end md:space-x-4 md:space-x-reverse">
            {/* City */}
            <div className="mb-4 md:mb-0 md:w-1/4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                {t('hotels.city')}
              </label>
              <select
                id="city"
                name="city"
                value={searchParams.city}
                onChange={handleSearchChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">كل المدن</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-4 md:mb-0 md:w-1/3">
              <div>
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('hotels.checkIn')}
                </label>
                <div className="relative">
                  <DatePicker
                    selected={searchParams.checkIn}
                    onChange={(date) => handleDateChange('checkIn', date)}
                    selectsStart
                    startDate={searchParams.checkIn}
                    endDate={searchParams.checkOut}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('hotels.checkOut')}
                </label>
                <div className="relative">
                  <DatePicker
                    selected={searchParams.checkOut}
                    onChange={(date) => handleDateChange('checkOut', date)}
                    selectsEnd
                    startDate={searchParams.checkIn}
                    endDate={searchParams.checkOut}
                    minDate={searchParams.checkIn}
                    dateFormat="dd/MM/yyyy"
                    className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Guests */}
            <div className="mb-4 md:mb-0 md:w-1/6">
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                {t('hotels.guests')}
              </label>
              <select
                id="guests"
                name="guests"
                value={searchParams.guests}
                onChange={handleSearchChange}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'ضيف' : 'ضيوف'}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Search Button */}
            <div className="md:w-1/6">
              <button
                type="button"
                onClick={() => {
                  // Force rerender by setting a dummy state
                  setShowFilters(x => !x);
                  setShowFilters(x => !x);
                }}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mx-auto" />
              </button>
            </div>
          </div>
          
          {/* Mobile Filters Toggle Button */}
          <div className="mt-4 flex lg:hidden">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 ml-2" />
              {showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}
            </button>
          </div>
          
          {/* More Filters (collapsible on mobile) */}
          <div className={`mt-4 pt-4 border-t border-gray-200 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Property Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('rentals.type')}
                </label>
                <select
                  id="type"
                  name="type"
                  value={searchParams.type}
                  onChange={handleSearchChange}
                  className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">الكل</option>
                  <option value="apartment">{t('rentals.apartments')}</option>
                  <option value="villa">{t('rentals.villas')}</option>
                </select>
              </div>
              
              {/* Bedrooms */}
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('rentals.bedrooms')}
                </label>
                <select
                  id="bedrooms"
                  name="bedrooms"
                  value={searchParams.bedrooms}
                  onChange={handleSearchChange}
                  className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="0">الكل</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              
              {/* Price Range Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('hotels.priceRange')}
                </label>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="number"
                    name="minPrice"
                    value={searchParams.minPrice}
                    onChange={handleSearchChange}
                    placeholder="من"
                    className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={searchParams.maxPrice}
                    onChange={handleSearchChange}
                    placeholder="إلى"
                    className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {filteredRentals.length} نتيجة
          </h2>
          
          <select
            className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            defaultValue="recommended"
          >
            <option value="recommended">موصى به</option>
            <option value="priceAsc">السعر: من الأرخص للأعلى</option>
            <option value="priceDesc">السعر: من الأعلى للأرخص</option>
            <option value="rating">التقييم</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map(rental => (
            <RentalCard key={rental.id} rental={rental} />
          ))}
        </div>
        
        {filteredRentals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لم يتم العثور على نتائج تطابق معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalsPage;
