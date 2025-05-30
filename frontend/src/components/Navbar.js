import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bars3Icon, XMarkIcon, UserCircleIcon, HomeIcon, LanguageIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';
import { changeLanguage } from '../i18n';

const Navbar = ({ user, onLogout }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md relative z-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-blue-700 font-bold text-xl">
                <Logo />
              </Link>
            </div>
            <div className="hidden sm:mr-6 sm:flex sm:space-x-8 sm:space-x-reverse">
              <Link
                to="/"
                className="border-transparent text-gray-700 hover:text-blue-700 hover:border-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <HomeIcon className="h-5 w-5 ml-1" />
                {t('common.home')}
              </Link>
              <Link
                to="/bus"
                className="border-transparent text-gray-700 hover:text-blue-700 hover:border-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                حجز تذاكر الحافلات
              </Link>
              <Link
                to="/rentals"
                className="border-transparent text-gray-700 hover:text-blue-700 hover:border-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                {t('footer.rentals')}
              </Link>
            </div>
          </div>
          <div className="hidden sm:mr-6 sm:flex sm:items-center">
            {/* Language Selector */}
            <div className="mr-4 relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-700 px-2 py-1 rounded-md">
                <LanguageIcon className="h-5 w-5 ml-1" />
                <span className="text-sm">{i18n.language.toUpperCase()}</span>
              </button>
              <div className="hidden group-hover:block absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md p-2 z-50">
                <button 
                  onClick={() => changeLanguage('ar')} 
                  className={`block px-4 py-2 text-sm ${i18n.language === 'ar' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'} rounded-md w-full text-right`}
                >
                  العربية
                </button>
                <button 
                  onClick={() => changeLanguage('fr')} 
                  className={`block px-4 py-2 text-sm ${i18n.language === 'fr' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'} rounded-md w-full text-right`}
                >
                  Français
                </button>
                <button 
                  onClick={() => changeLanguage('en')} 
                  className={`block px-4 py-2 text-sm ${i18n.language === 'en' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'} rounded-md w-full text-right`}
                >
                  English
                </button>
              </div>
            </div>
            {user ? (
              <div className="mr-3 relative">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <span className="flex items-center">
                      <UserCircleIcon className="w-5 h-5 ml-1" />
                      {user.full_name}
                    </span>
                  </Link>
                  <Link
                    to="/bookings"
                    className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t('booking.myBookings')}
                  </Link>
                  <Link
                    to="/bus/bookings"
                    className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    حجوزات الحافلات
                  </Link>
                  <button
                    onClick={onLogout}
                    className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t('auth.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('common.appName')}
            </Link>
            <Link
              to="/bus"
              className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              حجز تذاكر الحافلات
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="space-y-1">
                <div className="px-4 py-2 text-sm text-gray-500">
                  <span>{user.full_name}</span>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('profile.title')}
                </Link>
                <Link
                  to="/bookings"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('booking.myBookings')}
                </Link>
                <Link
                  to="/bus/bookings"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  حجوزات الحافلات
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-right block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
