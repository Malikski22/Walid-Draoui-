import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { StarIcon, MapPinIcon, WifiIcon, CakeIcon, HomeModernIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import HotelSearch from '../components/HotelSearch';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Use query params to get search parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const HotelCard = ({ hotel }) => {
  const { t } = useTranslation();
  
  // Generate star rating display
  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarSolidIcon 
        key={i} 
        className={`h-4 w-4 ${i < count ? 'text-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };
  
  // Placeholder amenities icons based on amenities names
  const getAmenityIcon = (amenity) => {
    switch(amenity.toLowerCase()) {
      case 'wifi':
        return <WifiIcon className="h-5 w-5" />;
      case 'breakfast':
      case 'فطور':
        return <CakeIcon className="h-5 w-5" />;
      default:
        return <HomeModernIcon className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img 
            src={hotel.images && hotel.images.length > 0 
              ? hotel.images[0] 
              : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60'} 
            alt={hotel.name} 
            className="h-48 w-full object-cover md:h-full"
          />
        </div>
        <div className="p-4 md:w-2/3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
              <div className="flex items-center mt-1">
                <div className="flex">{renderStars(hotel.stars)}</div>
                <span className="text-sm text-gray-500 mr-1">{hotel.stars} نجوم</span>
              </div>
              <div className="flex items-center mt-1 text-gray-500">
                <MapPinIcon className="h-4 w-4 ml-1" />
                <span className="text-sm">{hotel.city}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-700">
                {/* Placeholder price - would come from room data */}
                5000 دج 
                <span className="text-sm font-normal text-gray-500"> / {t('hotels.perNight')}</span>
              </div>
              <div className="mt-1">
                {hotel.rating > 0 && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                    {hotel.rating.toFixed(1)}/5
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <p className="mt-2 text-gray-600 line-clamp-2">{hotel.description}</p>
          
          <div className="mt-4 flex items-center">
            <div className="flex space-x-2 space-x-reverse ml-4">
              {hotel.amenities && hotel.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-xs text-gray-800">
                  {getAmenityIcon(amenity)}
                  <span className="mr-1">{amenity}</span>
                </span>
              ))}
            </div>
            
            <Link 
              to={`/hotels/${hotel.id}`} 
              className="bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800 transition-colors"
            >
              {t('hotels.viewDetails')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const HotelsPage = () => {
  const { t } = useTranslation();
  const query = useQuery();
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const city = query.get('city');
  const checkIn = query.get('checkIn');
  const checkOut = query.get('checkOut');
  const guests = query.get('guests');
  
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let response;
        
        if (city) {
          // Search with parameters
          response = await axios.post(`${API}/search/hotels`, {
            city: city,
            check_in_date: checkIn || new Date().toISOString(),
            check_out_date: checkOut || new Date(Date.now() + 86400000).toISOString(),
            guests_count: parseInt(guests) || 2
          });
        } else {
          // Get all hotels if no search parameter
          response = await axios.get(`${API}/hotels`);
        }
        
        setHotels(response.data);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotels();
  }, [city, checkIn, checkOut, guests, t]);
  
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-blue-700 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">
            {city 
              ? `${t('hotels.results')} - ${t(`cities.${city}`) || city}` 
              : t('hotels.search')
            }
          </h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="mb-8">
          <HotelSearch />
        </div>
        
        <div className="lg:flex lg:gap-8">
          {/* Filters - for future implementation */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="font-semibold text-lg mb-4">{t('hotels.filters')}</h3>
              {/* Price Range Filter */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">{t('hotels.priceRange')}</h4>
                {/* Placeholder for price slider */}
                <div className="h-4 bg-gray-200 rounded-full"></div>
              </div>
              
              {/* Star Rating Filter */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">{t('hotels.stars')}</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center">
                      <input
                        id={`star-${star}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`star-${star}`} className="mr-2 block text-sm text-gray-700">
                        {star} {t('hotels.stars')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Amenities Filter */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">{t('hotels.amenities')}</h4>
                <div className="space-y-2">
                  {['WiFi', 'موقف سيارات', 'فطور', 'مسبح'].map(amenity => (
                    <div key={amenity} className="flex items-center">
                      <input
                        id={`amenity-${amenity}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`amenity-${amenity}`} className="mr-2 block text-sm text-gray-700">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Hotels List */}
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
            ) : hotels.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded text-center">
                {t('hotels.noResults')}
              </div>
            ) : (
              <div className="space-y-4">
                {hotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
