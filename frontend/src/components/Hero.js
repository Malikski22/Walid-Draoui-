import React from 'react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div 
      className="relative bg-center bg-cover h-80 sm:h-96 flex items-center justify-center"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')` 
      }}
    >
      <div className="text-center px-4 sm:px-6 lg:px-8" dir="rtl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          {t('common.appName')}
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-xl text-white">
          اكتشف أفضل الفنادق في الجزائر ووفر وقتك مع نظام الحجز الذكي
        </p>
      </div>
    </div>
  );
};

export default Hero;
