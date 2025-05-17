import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  CheckIcon,
  BuildingOfficeIcon,
  ArrowLongRightIcon
} from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BusTripDetailPage = ({ user }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Booking form state
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passengerName, setPassengerName] = useState(user ? user.full_name : '');
  const [passengerPhone, setPassengerPhone] = useState(user ? user.phone_number : '');
  
  useEffect(() => {
    const fetchTripDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API}/bus/trips/${id}`);
        setTripDetails(response.data);
      } catch (err) {
        console.error('Error fetching trip details:', err);
        setError(err.message || t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchTripDetails();
  }, [id, t]);
  
  const handleSeatSelection = (seat) => {
    if (seat.is_available) {
      setSelectedSeat(seat);
    }
  };
  
  const handleBooking = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    if (!selectedSeat) {
      alert('الرجاء اختيار مقعد');
      return;
    }
    
    if (!passengerName || !passengerPhone) {
      alert('الرجاء إدخال بيانات المسافر');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API}/bus/bookings`,
        {
          trip_id: id,
          passenger_name: passengerName,
          passenger_phone: passengerPhone,
          seat_number: selectedSeat.seat_number
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // On success, navigate to bookings page
      navigate('/bus/bookings');
      
    } catch (error) {
      console.error('Booking error:', error);
      if (error.response && error.response.status === 400 && error.response.data.detail === 'Seat is already booked') {
        alert('المقعد محجوز بالفعل. الرجاء اختيار مقعد آخر.');
        // Refresh trip details to get updated seat availability
        window.location.reload();
      } else {
        alert('حدث خطأ أثناء الحجز. الرجاء المحاولة مرة أخرى.');
      }
    }
  };
  
  // Format bus type
  const formatBusType = (type) => {
    switch(type) {
      case 'standard':
        return 'عادي';
      case 'premium':
        return 'ممتاز';
      case 'vip':
        return 'VIP';
      default:
        return type;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'EEEE d MMMM yyyy', { locale: ar });
  };
  
  // Calculate trip duration
  const calculateDuration = (departure, arrival) => {
    const departureTimeParts = departure.split(':').map(part => parseInt(part));
    const arrivalTimeParts = arrival.split(':').map(part => parseInt(part));
    
    let hours = arrivalTimeParts[0] - departureTimeParts[0];
    let minutes = arrivalTimeParts[1] - departureTimeParts[1];
    
    if (minutes < 0) {
      hours--;
      minutes += 60;
    }
    
    if (hours < 0) {
      hours += 24; // Next day
    }
    
    return `${hours}س ${minutes}د`;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <div className="spinner border-4 border-t-blue-700 border-r-transparent border-b-transparent border-l-transparent rounded-full w-16 h-16 mx-auto animate-spin"></div>
          <p className="mt-4 text-xl text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }
  
  if (error || !tripDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <h3 className="text-lg font-medium mb-2">حدث خطأ</h3>
          <p>{error || t('common.error')}</p>
        </div>
      </div>
    );
  }
  
  const { trip, route, company, seats } = tripDetails;
  
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-blue-700 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">
            حجز رحلة حافلة
          </h1>
          <div className="mt-2 text-blue-100">
            من {t(`cities.${route.origin_city}`)} إلى {t(`cities.${route.destination_city}`)}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Trip Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <div className="flex items-center mb-4">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-600 ml-2" />
                  <h2 className="text-xl font-bold">{company.name}</h2>
                  <span className={`mr-4 text-sm px-2 py-1 rounded-full ${
                    trip.bus_type === 'premium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : trip.bus_type === 'vip' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    <TruckIcon className="h-4 w-4 inline ml-1" />
                    {formatBusType(trip.bus_type)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 space-x-reverse mb-2">
                  <div className="flex items-center text-gray-700">
                    <ClockIcon className="h-5 w-5 ml-1" />
                    <span>{formatDate(trip.departure_date)}</span>
                  </div>
                </div>
                
                <div className="flex items-center mt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">{trip.departure_time}</div>
                    <div className="text-sm text-gray-600">{t(`cities.${route.origin_city}`)}</div>
                  </div>
                  
                  <div className="px-4 mx-2">
                    <div className="text-xs text-gray-500 text-center mb-1">
                      {calculateDuration(trip.departure_time, trip.arrival_time)}
                    </div>
                    <div className="relative">
                      <div className="h-0.5 bg-gray-300 w-24 md:w-36"></div>
                      <ArrowLongRightIcon className="h-5 w-5 text-gray-400 absolute -top-2 -right-2" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold">{trip.arrival_time}</div>
                    <div className="text-sm text-gray-600">{t(`cities.${route.destination_city}`)}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 md:ml-4 text-center md:text-right">
                <div className="text-3xl font-bold text-blue-700">
                  {trip.price.toLocaleString()} دج
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  للمقعد الواحد
                </div>
              </div>
            </div>
            
            {/* Features */}
            {trip.features && trip.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">الخدمات المتوفرة</h3>
                <div className="flex flex-wrap">
                  {trip.features.map((feature, idx) => (
                    <span key={idx} className="ml-4 mb-2 flex items-center text-gray-700">
                      <CheckIcon className="h-5 w-5 text-green-500 ml-1" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Seat Selection */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-lg font-medium mb-4">اختر مقعدك</h3>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white border border-gray-300 rounded ml-2"></div>
                  <span className="text-sm text-gray-600">متاح</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-400 rounded ml-2"></div>
                  <span className="text-sm text-gray-600">محجوز</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded ml-2"></div>
                  <span className="text-sm text-gray-600">اختيارك</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-300 relative">
                {/* Bus driver */}
                <div className="absolute top-4 right-4 flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <span className="mr-2 text-sm text-gray-600">السائق</span>
                </div>
                
                {/* Bus shape */}
                <div className="mt-16">
                  {/* Seats grid - dynamically generated based on seats data */}
                  <div className="grid grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
                    {seats.map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatSelection(seat)}
                        disabled={!seat.is_available}
                        className={`w-12 h-12 rounded flex items-center justify-center text-sm font-medium ${
                          selectedSeat && selectedSeat.id === seat.id
                            ? 'bg-blue-500 text-white'
                            : seat.is_available
                            ? 'bg-white border border-gray-300 hover:border-blue-500'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {seat.seat_number}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Passenger Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">معلومات المسافر</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل الاسم الكامل"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل رقم الهاتف"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">ملخص الحجز</h3>
            
            <div className="divide-y divide-gray-200">
              <div className="py-2 flex justify-between">
                <span className="text-gray-600">الرحلة</span>
                <span className="font-medium">
                  {t(`cities.${route.origin_city}`)} - {t(`cities.${route.destination_city}`)}
                </span>
              </div>
              
              <div className="py-2 flex justify-between">
                <span className="text-gray-600">التاريخ</span>
                <span className="font-medium">{formatDate(trip.departure_date)}</span>
              </div>
              
              <div className="py-2 flex justify-between">
                <span className="text-gray-600">وقت المغادرة</span>
                <span className="font-medium">{trip.departure_time}</span>
              </div>
              
              <div className="py-2 flex justify-between">
                <span className="text-gray-600">شركة النقل</span>
                <span className="font-medium">{company.name}</span>
              </div>
              
              <div className="py-2 flex justify-between">
                <span className="text-gray-600">نوع الحافلة</span>
                <span className="font-medium">{formatBusType(trip.bus_type)}</span>
              </div>
              
              {selectedSeat && (
                <div className="py-2 flex justify-between">
                  <span className="text-gray-600">المقعد</span>
                  <span className="font-medium">رقم {selectedSeat.seat_number}</span>
                </div>
              )}
              
              <div className="py-2 flex justify-between font-bold">
                <span>السعر الإجمالي</span>
                <span className="text-blue-700">
                  {selectedSeat ? selectedSeat.price.toLocaleString() : trip.price.toLocaleString()} دج
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 sm:mb-0 px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              العودة للبحث
            </button>
            
            <button
              onClick={handleBooking}
              disabled={!selectedSeat}
              className={`px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 ${
                !selectedSeat ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              تأكيد الحجز
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusTripDetailPage;
