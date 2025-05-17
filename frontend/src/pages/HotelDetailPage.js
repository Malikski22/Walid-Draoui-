import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  UserGroupIcon, 
  WifiIcon, 
  TvIcon, 
  HomeModernIcon, 
  CheckIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import DatePicker from "react-datepicker";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HotelDetailPage = ({ user }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  
  // Booking form state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDates, setBookingDates] = useState({
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 86400000) // Tomorrow
  });
  const [guestsCount, setGuestsCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  
  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch hotel details
        const hotelResponse = await axios.get(`${API}/hotels/${id}`);
        setHotel(hotelResponse.data);
        
        // Fetch rooms for this hotel
        const roomsResponse = await axios.get(`${API}/rooms/hotel/${id}`);
        setRooms(roomsResponse.data);
      } catch (err) {
        console.error('Error fetching hotel details:', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotelDetails();
  }, [id, t]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleRoomSelection = (room) => {
    setSelectedRoom(room);
  };
  
  const calculateTotalPrice = () => {
    if (!selectedRoom) return 0;
    
    const checkIn = new Date(bookingDates.checkIn);
    const checkOut = new Date(bookingDates.checkOut);
    const days = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
    
    return selectedRoom.price_per_night * days;
  };
  
  const handleBooking = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    if (!selectedRoom) return;
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API}/bookings`,
        {
          hotel_id: hotel.id,
          room_id: selectedRoom.id,
          check_in_date: bookingDates.checkIn.toISOString(),
          check_out_date: bookingDates.checkOut.toISOString(),
          guests_count: guestsCount,
          special_requests: specialRequests
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // On success, navigate to bookings page
      navigate('/bookings');
      
    } catch (error) {
      console.error('Booking error:', error);
      setError(t('booking.bookingError'));
    }
  };
  
  // Generate star rating display
  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarSolidIcon 
        key={i} 
        className={`h-5 w-5 ${i < count ? 'text-yellow-500' : 'text-gray-300'}`} 
      />
    ));
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
  
  if (error || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <h3 className="text-lg font-medium mb-2">حدث خطأ</h3>
          <p>{error || t('common.error')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hotel Hero */}
      <div 
        className="w-full h-64 sm:h-96 bg-center bg-cover"
        style={{ 
          backgroundImage: `url(${hotel.images && hotel.images.length > 0 
            ? hotel.images[0] 
            : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1470&q=80'})` 
        }}
      ></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 -mt-10 sm:-mt-16 relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{hotel.name}</h1>
              
              <div className="flex items-center mt-2">
                <div className="flex ml-2">{renderStars(hotel.stars)}</div>
                <span className="text-gray-600">{hotel.stars} نجوم</span>
              </div>
              
              <div className="flex items-center mt-1 text-gray-600">
                <MapPinIcon className="h-5 w-5 ml-1" aria-hidden="true" />
                <span>{hotel.address}, {hotel.city}</span>
              </div>
            </div>
            
            {hotel.rating > 0 && (
              <div className="mt-4 md:mt-0 bg-blue-100 text-blue-800 py-2 px-4 rounded-lg">
                <div className="text-2xl font-bold">{hotel.rating.toFixed(1)}/5</div>
                <div className="text-sm">{hotel.reviews_count} {t('hotels.reviewsCount')}</div>
              </div>
            )}
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mt-8">
            <nav className="flex space-x-8 space-x-reverse">
              <button
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description' 
                    ? 'border-blue-700 text-blue-700' 
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('description')}
              >
                {t('hotels.description')}
              </button>
              <button
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rooms' 
                    ? 'border-blue-700 text-blue-700' 
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('rooms')}
              >
                {t('hotels.availableRooms')}
              </button>
              <button
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'location' 
                    ? 'border-blue-700 text-blue-700' 
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('location')}
              >
                {t('hotels.location')}
              </button>
              <button
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'amenities' 
                    ? 'border-blue-700 text-blue-700' 
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('amenities')}
              >
                {t('hotels.amenities')}
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('hotels.description')}</h3>
                <p className="text-gray-700 whitespace-pre-line">{hotel.description}</p>
                
                {/* Images Gallery */}
                {hotel.images && hotel.images.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">صور الفندق</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {hotel.images.map((image, index) => (
                        <div key={index} className="h-48 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${hotel.name} - ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'rooms' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('hotels.availableRooms')}</h3>
                
                {/* Booking Form */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('hotels.checkIn')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <DatePicker
                          selected={bookingDates.checkIn}
                          onChange={date => setBookingDates({...bookingDates, checkIn: date})}
                          selectsStart
                          startDate={bookingDates.checkIn}
                          endDate={bookingDates.checkOut}
                          minDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                          className="block w-full rounded-md border-gray-300 pr-10 py-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('hotels.checkOut')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <DatePicker
                          selected={bookingDates.checkOut}
                          onChange={date => setBookingDates({...bookingDates, checkOut: date})}
                          selectsEnd
                          startDate={bookingDates.checkIn}
                          endDate={bookingDates.checkOut}
                          minDate={new Date(bookingDates.checkIn.getTime() + 86400000)}
                          dateFormat="dd/MM/yyyy"
                          className="block w-full rounded-md border-gray-300 pr-10 py-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('hotels.guests')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <UserGroupIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          value={guestsCount}
                          onChange={e => setGuestsCount(parseInt(e.target.value))}
                          className="block w-full rounded-md border-gray-300 pr-10 py-2"
                        >
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'ضيف' : 'ضيوف'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Available Rooms List */}
                <div className="space-y-4">
                  {rooms.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">لا توجد غرف متاحة حاليًا</p>
                  ) : (
                    rooms.map(room => (
                      <div 
                        key={room.id} 
                        className={`border rounded-lg p-4 ${
                          selectedRoom && selectedRoom.id === room.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{room.name}</h4>
                            <p className="text-gray-600 text-sm mt-1">{room.description}</p>
                            <div className="mt-2">
                              <span className="text-sm bg-gray-100 rounded-full px-3 py-1">
                                سعة: {room.capacity} {room.capacity === 1 ? 'شخص' : 'أشخاص'}
                              </span>
                            </div>
                            {room.images && room.images.length > 0 && (
                              <div className="mt-3 flex space-x-2 space-x-reverse">
                                {room.images.slice(0, 3).map((img, idx) => (
                                  <img 
                                    key={idx} 
                                    src={img} 
                                    alt={`${room.name} - ${idx+1}`}
                                    className="h-16 w-20 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="mt-4 sm:mt-0 text-right">
                            <div className="text-xl font-bold text-blue-700">
                              {room.price_per_night.toLocaleString()} دج
                              <span className="text-sm font-normal text-gray-500"> / {t('hotels.perNight')}</span>
                            </div>
                            <button
                              onClick={() => handleRoomSelection(room)}
                              className={`mt-2 px-4 py-2 rounded text-sm ${
                                selectedRoom && selectedRoom.id === room.id
                                  ? 'bg-green-600 text-white'
                                  : 'bg-blue-700 text-white hover:bg-blue-800'
                              }`}
                            >
                              {selectedRoom && selectedRoom.id === room.id ? (
                                <span className="flex items-center justify-center">
                                  <CheckIcon className="h-4 w-4 ml-1" />
                                  تم الاختيار
                                </span>
                              ) : (
                                t('hotels.selectRoom')
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Booking Summary */}
                {selectedRoom && (
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold mb-4">{t('booking.summary')}</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{hotel.name}</span>
                        <span>{selectedRoom.name}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>{t('hotels.checkIn')}</span>
                        <span>{bookingDates.checkIn.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>{t('hotels.checkOut')}</span>
                        <span>{bookingDates.checkOut.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>{t('hotels.guests')}</span>
                        <span>{guestsCount} {guestsCount === 1 ? 'ضيف' : 'ضيوف'}</span>
                      </div>
                      <div className="border-t border-gray-300 my-2 pt-2">
                        <div className="flex justify-between font-bold">
                          <span>{t('booking.totalStay')}</span>
                          <span className="text-blue-700">{calculateTotalPrice().toLocaleString()} دج</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('booking.specialRequests')}
                      </label>
                      <textarea
                        value={specialRequests}
                        onChange={e => setSpecialRequests(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border-gray-300 shadow-sm"
                        placeholder="أي طلبات خاصة للفندق..."
                      ></textarea>
                    </div>
                    
                    <button
                      onClick={handleBooking}
                      className="mt-4 w-full bg-blue-700 text-white px-4 py-2 rounded font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      {t('booking.confirmBooking')}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'location' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('hotels.location')}</h3>
                <p className="text-gray-700 mb-4">
                  <MapPinIcon className="h-5 w-5 inline ml-1" />
                  {hotel.address}, {hotel.city}
                </p>
                
                {/* Map Placeholder - Would be replaced with an actual map component */}
                <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                  <p className="text-gray-500">يظهر هنا خريطة موقع الفندق</p>
                </div>
              </div>
            )}
            
            {activeTab === 'amenities' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('hotels.amenities')}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities && hotel.amenities.length > 0 ? (
                    hotel.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center ml-3">
                          {amenity.toLowerCase().includes('wifi') ? (
                            <WifiIcon className="h-6 w-6" />
                          ) : amenity.toLowerCase().includes('tv') ? (
                            <TvIcon className="h-6 w-6" />
                          ) : amenity.toLowerCase().includes('free') ? (
                            <CurrencyDollarIcon className="h-6 w-6" />
                          ) : amenity.toLowerCase().includes('star') ? (
                            <StarIcon className="h-6 w-6" />
                          ) : (
                            <HomeModernIcon className="h-6 w-6" />
                          )}
                        </div>
                        <span>{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full">لم يتم تحديد وسائل الراحة بعد</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;
