import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CalendarDaysIcon, 
  UserGroupIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BookingCard = ({ booking, onCancel }) => {
  const { t } = useTranslation();
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  
  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        // Fetch hotel data
        const hotelResponse = await axios.get(`${API}/hotels/${booking.hotel_id}`);
        setHotel(hotelResponse.data);
        
        // For demo purposes we'll just use placeholder room data
        // In a real app, you'd fetch room details from the API
        setRoom({
          name: 'غرفة قياسية',
          price_per_night: 5000
        });
        
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };
    
    fetchRelatedData();
  }, [booking]);
  
  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-DZ');
  };
  
  // Calculate nights
  const calculateNights = () => {
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
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
          icon: <ClockIcon className="h-5 w-5 ml-1" />
        };
      case 'cancelled':
        return { 
          bg: 'bg-red-100', 
          text: 'text-red-800',
          icon: <XCircleIcon className="h-5 w-5 ml-1" />
        };
      default:
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-800',
          icon: <CheckIcon className="h-5 w-5 ml-1" />
        };
    }
  };
  
  const statusBadge = getStatusBadge();
  
  if (!hotel) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
            <div className="flex items-center mt-1 text-gray-600">
              <MapPinIcon className="h-5 w-5 ml-1" />
              <span>{hotel.city}</span>
            </div>
            {room && (
              <p className="mt-1 text-gray-600">{room.name}</p>
            )}
          </div>
          
          <div className="mt-4 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
              {statusBadge.icon}
              {t(`booking.status.${booking.status}`)}
            </span>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center text-gray-700">
                <CalendarDaysIcon className="h-5 w-5 ml-2" />
                <div>
                  <div className="text-sm text-gray-500">{t('hotels.checkIn')}</div>
                  <div>{formatDate(booking.check_in_date)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center text-gray-700">
                <CalendarDaysIcon className="h-5 w-5 ml-2" />
                <div>
                  <div className="text-sm text-gray-500">{t('hotels.checkOut')}</div>
                  <div>{formatDate(booking.check_out_date)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center text-gray-700">
                <UserGroupIcon className="h-5 w-5 ml-2" />
                <div>
                  <div className="text-sm text-gray-500">{t('hotels.guests')}</div>
                  <div>{booking.guests_count} {booking.guests_count === 1 ? 'ضيف' : 'ضيوف'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">{t('booking.totalStay')}</div>
            <div className="text-lg font-bold text-blue-700">
              {booking.total_price.toLocaleString()} دج
              <span className="text-sm font-normal text-gray-600 mr-1">
                ({calculateNights()} {t('booking.nights')})
              </span>
            </div>
          </div>
          
          <div className="space-x-2 space-x-reverse">
            <Link
              to={`/hotels/${booking.hotel_id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {t('hotels.viewDetails')}
            </Link>
            
            {booking.status !== 'cancelled' && (
              <button
                onClick={() => onCancel(booking.id)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                {t('booking.cancelBooking')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingsPage = ({ user }) => {
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
          throw new Error('You must be logged in to view bookings');
        }
        
        const response = await axios.get(`${API}/bookings/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [t]);
  
  const handleCancelBooking = async (bookingId) => {
    // In a real application, you would send a request to update the booking status
    // For this demo, we'll just update the UI
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      )
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="spinner border-4 border-t-blue-700 border-r-transparent border-b-transparent border-l-transparent rounded-full w-16 h-16 mx-auto animate-spin"></div>
          <p className="mt-4 text-xl text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
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
            {t('booking.myBookings')}
          </h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">{t('booking.noBookings')}</h3>
            <p className="text-gray-600 mb-6">لم تقم بحجز أي فنادق حتى الآن.</p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
            >
              استكشف الفنادق
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking}
                onCancel={handleCancelBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
