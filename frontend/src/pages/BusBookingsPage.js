import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  TicketIcon,
  CheckCircleIcon,
  ClockIcon as PendingIcon,
  XCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BusBookingCard = ({ bookingData, onCancel }) => {
  const { t } = useTranslation();
  const { booking, trip, route, company } = bookingData;
  
  if (!trip || !route || !company) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-500">
          <TicketIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="mb-2">تفاصيل الحجز غير متوفرة</p>
          <p className="text-sm">رقم الحجز: {booking.id.substring(0, 8)}</p>
        </div>
      </div>
    );
  }
  
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
  
  // Get status badge styling
  const getStatusBadge = () => {
    switch(booking.status) {
      case 'confirmed':
        return { 
          bg: 'bg-green-100', 
          text: 'text-green-800',
          icon: <CheckCircleIcon className="h-5 w-5 ml-1" /> 
        };
      case 'pending':
        return { 
          bg: 'bg-yellow-100', 
          text: 'text-yellow-800',
          icon: <PendingIcon className="h-5 w-5 ml-1" />
        };
      case 'canceled':
        return { 
          bg: 'bg-red-100', 
          text: 'text-red-800',
          icon: <XCircleIcon className="h-5 w-5 ml-1" />
        };
      case 'completed':
        return { 
          bg: 'bg-blue-100', 
          text: 'text-blue-800',
          icon: <CheckIcon className="h-5 w-5 ml-1" />
        };
      default:
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-800',
          icon: <TicketIcon className="h-5 w-5 ml-1" />
        };
    }
  };
  
  const statusBadge = getStatusBadge();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <div className="flex items-center">
              <TruckIcon className="h-5 w-5 text-blue-700 ml-2" />
              <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
              <span className="mr-2 text-sm text-gray-600">({formatBusType(trip.bus_type)})</span>
            </div>
            
            <div className="flex items-center mt-2 text-gray-600">
              <MapPinIcon className="h-5 w-5 ml-1" />
              <span>{t(`cities.${route.origin_city}`)} - {t(`cities.${route.destination_city}`)}</span>
            </div>
            
            <div className="flex items-center mt-1 text-gray-600">
              <ClockIcon className="h-5 w-5 ml-1" />
              <span>
                {formatDate(trip.departure_date)} - {trip.departure_time}
              </span>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
              {statusBadge.icon}
              {t(`booking.status.${booking.status}`)}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">رقم المقعد</div>
              <div className="font-medium">{booking.seat_number}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">اسم المسافر</div>
              <div className="font-medium">{booking.passenger_name}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">تاريخ الحجز</div>
              <div className="font-medium">{new Date(booking.booking_date).toLocaleDateString('ar-DZ')}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">السعر</div>
              <div className="font-medium text-blue-700">{booking.price.toLocaleString()} دج</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            رقم التذكرة: #{booking.id.substring(0, 8).toUpperCase()}
          </div>
          
          <div className="space-x-2 space-x-reverse">
            {booking.status === 'pending' || booking.status === 'confirmed' ? (
              <button
                onClick={() => onCancel(booking.id)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                إلغاء الحجز
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const BusBookingsPage = ({ user }) => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('يجب تسجيل الدخول لعرض الحجوزات');
        }
        
        const response = await axios.get(`${API}/bus/bookings/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bus bookings:', err);
        setError(err.message || t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [t]);
  
  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${API}/bus/bookings/${bookingId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update the booking status in the state
      setBookings(prevBookings => 
        prevBookings.map(bookingData => 
          bookingData.booking.id === bookingId 
            ? { ...bookingData, booking: { ...bookingData.booking, status: 'canceled' } } 
            : bookingData
        )
      );
      
    } catch (err) {
      console.error('Error canceling booking:', err);
      alert('حدث خطأ أثناء إلغاء الحجز. الرجاء المحاولة مرة أخرى.');
    }
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
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <h3 className="text-lg font-medium mb-2">حدث خطأ</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-blue-700 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">
            حجوزات الحافلات
          </h1>
          <div className="mt-2 text-blue-100">
            عرض جميع حجوزات تذاكر الحافلات الخاصة بك
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <TruckIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد حجوزات</h3>
            <p className="text-gray-600 mb-6">لم تقم بحجز أي تذاكر حافلات حتى الآن.</p>
            <Link
              to="/bus"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
            >
              البحث عن رحلات
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(bookingData => (
              <BusBookingCard 
                key={bookingData.booking.id} 
                bookingData={bookingData}
                onCancel={handleCancelBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusBookingsPage;
