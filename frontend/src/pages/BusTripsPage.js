import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowLongRightIcon,
  TruckIcon,
  BuildingOfficeIcon,
  WifiIcon,
  TvIcon,
  TicketIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Use query params to get search parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const BusTripCard = ({ trip, route, company }) => {
  const { t } = useTranslation();
  
  // Format the bus type
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
  
  // Format the time (e.g., 08:00)
  const formatTime = (timeString) => {
    return timeString;
  };
  
  // Get feature icon
  const getFeatureIcon = (feature) => {
    if (feature.includes('واي فاي')) {
      return <WifiIcon className="h-4 w-4 ml-1" />;
    } else if (feature.includes('شاش')) {
      return <TvIcon className="h-4 w-4 ml-1" />;
    } else {
      return null;
    }
  };
  
  // Calculate trip duration in hours and minutes
  const calculateDuration = () => {
    const departureTimeParts = trip.departure_time.split(':').map(part => parseInt(part));
    const arrivalTimeParts = trip.arrival_time.split(':').map(part => parseInt(part));
    
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
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'EEEE d MMMM yyyy', { locale: ar });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div>
            <div className="flex items-center">
              <span className={`text-sm px-2 py-1 rounded-full ${
                trip.bus_type === 'premium' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : trip.bus_type === 'vip' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
              }`}>
                <TruckIcon className="h-4 w-4 inline ml-1" />
                {formatBusType(trip.bus_type)}
              </span>
              <span className="text-sm text-gray-600 mr-2">
                <BuildingOfficeIcon className="h-4 w-4 inline ml-1" />
                {company.name}
              </span>
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatTime(trip.departure_time)}</div>
                <div className="text-sm text-gray-600">{route.origin_city}</div>
              </div>
              
              <div className="px-4">
                <div className="text-xs text-gray-500 text-center mb-1">{calculateDuration()}</div>
                <div className="relative">
                  <div className="h-0.5 bg-gray-300 w-16 sm:w-24"></div>
                  <ArrowLongRightIcon className="h-5 w-5 text-gray-400 absolute -top-2 -right-2" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">{formatTime(trip.arrival_time)}</div>
                <div className="text-sm text-gray-600">{route.destination_city}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 text-left sm:text-right">
            <div className="text-2xl font-bold text-blue-700">
              {trip.price.toLocaleString()} دج
            </div>
            <div className="text-sm text-gray-600">
              <UserGroupIcon className="h-4 w-4 inline ml-1" />
              {trip.available_seats} مقعد متاح
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 inline ml-1" />
                {formatDate(trip.departure_date)}
              </div>
              
              <div className="mt-2 flex flex-wrap">
                {trip.features && trip.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="mr-2 mb-2 inline-flex items-center text-xs text-gray-500">
                    {getFeatureIcon(feature)}
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <Link 
              to={`/bus/trips/${trip.id}`}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800"
            >
              <TicketIcon className="h-5 w-5 ml-1" />
              اختر المقعد
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const BusTripsPage = () => {
  const { t } = useTranslation();
  const query = useQuery();
  const location = useLocation();
  
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const originCity = query.get('originCity');
  const destinationCity = query.get('destinationCity');
  const departureDate = query.get('departureDate');
  const passengers = query.get('passengers');
  
  // Filters
  const [busTypes, setBusTypes] = useState({
    standard: true,
    premium: true,
    vip: true
  });
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'morning', 'afternoon', 'evening'
  const [sortBy, setSortBy] = useState('departure_time'); // 'departure_time', 'price', 'duration'
  
  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!originCity || !destinationCity || !departureDate) {
          throw new Error('بيانات البحث غير كاملة');
        }
        
        const response = await axios.post(`${API}/bus/search`, {
          origin_city: originCity,
          destination_city: destinationCity,
          departure_date: departureDate,
          passengers_count: parseInt(passengers) || 1
        });
        
        setTrips(response.data);
      } catch (err) {
        console.error('Error fetching bus trips:', err);
        setError(err.message || t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrips();
  }, [originCity, destinationCity, departureDate, passengers, t]);
  
  // Filter and sort trips
  const filteredTrips = trips.filter(tripData => {
    const trip = tripData.trip;
    
    // Filter by bus type
    if (!busTypes[trip.bus_type]) {
      return false;
    }
    
    // Filter by time of day
    if (timeFilter !== 'all') {
      const departureParts = trip.departure_time.split(':');
      const hour = parseInt(departureParts[0]);
      
      if (timeFilter === 'morning' && (hour < 5 || hour >= 12)) {
        return false;
      } else if (timeFilter === 'afternoon' && (hour < 12 || hour >= 17)) {
        return false;
      } else if (timeFilter === 'evening' && (hour < 17 || hour >= 23)) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    const tripA = a.trip;
    const tripB = b.trip;
    
    if (sortBy === 'price') {
      return tripA.price - tripB.price;
    } else if (sortBy === 'departure_time') {
      return tripA.departure_time.localeCompare(tripB.departure_time);
    } else if (sortBy === 'duration') {
      // Calculate duration in minutes for comparison
      const getDuration = (trip) => {
        const departureTimeParts = trip.departure_time.split(':').map(part => parseInt(part));
        const arrivalTimeParts = trip.arrival_time.split(':').map(part => parseInt(part));
        
        let hours = arrivalTimeParts[0] - departureTimeParts[0];
        let minutes = arrivalTimeParts[1] - departureTimeParts[1];
        
        if (minutes < 0) {
          hours--;
          minutes += 60;
        }
        
        if (hours < 0) {
          hours += 24; // Next day
        }
        
        return hours * 60 + minutes;
      };
      
      return getDuration(tripA) - getDuration(tripB);
    }
    
    return 0;
  });
  
  const handleBusTypeChange = (type) => {
    setBusTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-blue-700 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">
            رحلات الحافلات من {t(`cities.${originCity}`)} إلى {t(`cities.${destinationCity}`)}
          </h1>
          <div className="mt-2 text-blue-100">
            {new Date(departureDate).toLocaleDateString('ar-DZ', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            {passengers && ` · ${passengers} مسافر${parseInt(passengers) !== 1 ? 'ين' : ''}`}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Filters */}
          <div className="lg:w-1/4 mb-6 lg:mb-0">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">الفلاتر</h3>
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
              </div>
              
              {/* Bus Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">نوع الحافلة</h4>
                <div className="space-y-2">
                  {['standard', 'premium', 'vip'].map(type => (
                    <div key={type} className="flex items-center">
                      <input
                        id={`type-${type}`}
                        type="checkbox"
                        checked={busTypes[type]}
                        onChange={() => handleBusTypeChange(type)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`type-${type}`} className="mr-2 block text-sm text-gray-700">
                        {type === 'standard' ? 'عادي' : type === 'premium' ? 'ممتاز' : 'VIP'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Time Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">وقت المغادرة</h4>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'جميع الأوقات' },
                    { id: 'morning', label: 'صباحاً (5 - 12)' },
                    { id: 'afternoon', label: 'ظهراً (12 - 17)' },
                    { id: 'evening', label: 'مساءً (17 - 23)' }
                  ].map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={`time-${option.id}`}
                        type="radio"
                        checked={timeFilter === option.id}
                        onChange={() => setTimeFilter(option.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor={`time-${option.id}`} className="mr-2 block text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Sort By */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">ترتيب حسب</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="departure_time">وقت المغادرة</option>
                  <option value="price">السعر (من الأقل إلى الأعلى)</option>
                  <option value="duration">مدة الرحلة</option>
                </select>
              </div>
            </div>
            
            {/* Back to Search */}
            <div className="mt-4">
              <Link
                to="/bus"
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                تعديل البحث
              </Link>
            </div>
          </div>
          
          {/* Bus Trips List */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-8">
                <div className="spinner border-4 border-t-blue-700 border-r-transparent border-b-transparent border-l-transparent rounded-full w-10 h-10 mx-auto animate-spin"></div>
                <p className="mt-4 text-gray-600">{t('common.loading')}</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center">
                {error}
              </div>
            ) : filteredTrips.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded text-center">
                لا توجد رحلات متاحة تطابق معايير البحث
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTrips.map((tripData, index) => (
                  <BusTripCard 
                    key={tripData.trip.id}
                    trip={tripData.trip}
                    route={tripData.route}
                    company={tripData.company}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusTripsPage;
