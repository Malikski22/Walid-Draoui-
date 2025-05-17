import React from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import HotelSearch from '../components/HotelSearch';
import { MapPinIcon, BuildingOfficeIcon, SparklesIcon } from '@heroicons/react/24/outline';

const FeaturedDestination = ({ city, image, description }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg">
      <img 
        src={image} 
        alt={city} 
        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 right-0 p-4 text-right">
        <h3 className="text-xl font-bold text-white flex items-center justify-end">
          <MapPinIcon className="h-5 w-5 ml-1" />
          {city}
        </h3>
        <p className="text-gray-200 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { t } = useTranslation();
  
  const featuredDestinations = [
    {
      city: t('cities.algiers'),
      image: 'https://images.unsplash.com/photo-1595536446891-b106e954b66b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      description: 'العاصمة النابضة بالحياة مع مزيج من التاريخ والثقافة'
    },
    {
      city: t('cities.oran'),
      image: 'https://images.unsplash.com/photo-1574270981993-db3d9554ae29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80',
      description: 'مدينة ساحلية جميلة تشتهر بتراثها الثقافي المتنوع'
    },
    {
      city: t('cities.constantine'),
      image: 'https://images.unsplash.com/photo-1565686160082-4e2a57b73bdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
      description: 'مدينة الجسور المعلقة ذات المناظر الخلابة والتاريخ العريق'
    }
  ];

  const features = [
    {
      icon: <BuildingOfficeIcon className="h-8 w-8 text-blue-700" />,
      title: 'فنادق متنوعة',
      description: 'اختر من بين مجموعة واسعة من الفنادق لجميع الميزانيات والاحتياجات'
    },
    {
      icon: <MapPinIcon className="h-8 w-8 text-blue-700" />,
      title: 'وجهات متعددة',
      description: 'استكشف أفضل المدن السياحية في الجزائر من خلال منصتنا'
    },
    {
      icon: <SparklesIcon className="h-8 w-8 text-blue-700" />,
      title: 'مساعد ذكي',
      description: 'احصل على توصيات مخصصة وإجابات لجميع استفساراتك'
    }
  ];

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Hero Section & Search */}
      <Hero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <HotelSearch />
        
        {/* Featured Destinations */}
        <section className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            وجهات مميزة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((destination, index) => (
              <FeaturedDestination 
                key={index}
                city={destination.city}
                image={destination.image}
                description={destination.description}
              />
            ))}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="mt-16 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            لماذا تختار DzSmartBooking؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bus Tickets Section */}
        <section className="mt-16 mb-16 bg-blue-50 py-10 px-4 sm:px-6 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              حجز تذاكر الحافلات بين المدن
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              استكشف خدمة حجز تذاكر الحافلات بين المدن الجزائرية. احجز بسهولة وسرعة مع أفضل شركات النقل.
            </p>
            <Link
              to="/bus"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 md:py-4 md:text-lg md:px-8"
            >
              حجز تذاكر الحافلات
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
