import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  BanknotesIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';

const PaymentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get booking details from location state or use defaults
  const bookingDetails = location.state?.booking || {
    id: 'TEMP' + Math.floor(Math.random() * 10000),
    totalPrice: 12500,
    type: 'hotel' // or 'bus' or 'rental'
  };
  
  const [paymentMethod, setPaymentMethod] = useState('edahabia');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'error', null
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Allow only numbers and format with spaces
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
      
      setCardDetails({ ...cardDetails, [name]: formattedValue });
    } else if (name === 'expiryDate') {
      // Format as MM/YY
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(.{2})/, '$1/')
        .substr(0, 5);
      
      setCardDetails({ ...cardDetails, [name]: formattedValue });
    } else if (name === 'cvv') {
      // Allow only 3-4 digits
      const formattedValue = value.replace(/\D/g, '').substr(0, 4);
      setCardDetails({ ...cardDetails, [name]: formattedValue });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Simulate successful payment
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      setPaymentStatus(success ? 'success' : 'error');
      setIsProcessing(false);
      
      if (success) {
        // Redirect after 2 seconds on success
        setTimeout(() => {
          if (bookingDetails.type === 'hotel') {
            navigate('/bookings');
          } else if (bookingDetails.type === 'bus') {
            navigate('/bus/bookings');
          } else {
            navigate('/rentals/bookings');
          }
        }, 2000);
      }
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50" dir={t('common.direction', { defaultValue: 'rtl' })}>
      <div className="bg-blue-700 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            {t('payment.title')}
          </h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Payment Status Messages */}
          {paymentStatus === 'success' && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 ml-3" />
              <span className="text-green-700">{t('payment.paymentSuccess')}</span>
            </div>
          )}
          
          {paymentStatus === 'error' && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 ml-3" />
              <span className="text-red-700">{t('payment.paymentError')}</span>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-blue-50 border-b border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <LockClosedIcon className="h-5 w-5 ml-2 text-blue-700" />
                {t('payment.secure')}
              </h2>
              <p className="mt-1 text-gray-600">
                تفاصيل عملية الدفع الخاصة بك محمية ومشفرة
              </p>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center pb-6 mb-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('booking.summary')}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    رقم الحجز: #{bookingDetails.id}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-700">
                    {bookingDetails.totalPrice.toLocaleString()} دج
                  </div>
                  <p className="text-gray-600 text-sm">{t('payment.amount')}</p>
                </div>
              </div>
              
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('payment.paymentMethod')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('edahabia')}
                    className={`border rounded-lg p-4 flex items-center ${
                      paymentMethod === 'edahabia' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <BanknotesIcon className="h-10 w-10 text-blue-700 ml-3" />
                    <div className="text-right">
                      <div className="font-semibold">{t('payment.edahabia')}</div>
                      <div className="text-sm text-gray-500">بطاقة الدفع الإلكتروني الذهبية</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cib')}
                    className={`border rounded-lg p-4 flex items-center ${
                      paymentMethod === 'cib' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <BuildingLibraryIcon className="h-10 w-10 text-blue-700 ml-3" />
                    <div className="text-right">
                      <div className="font-semibold">{t('payment.cib')}</div>
                      <div className="text-sm text-gray-500">بطاقة ما بين البنوك CIB</div>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Card Details Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    تفاصيل البطاقة
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('payment.cardNumber')}
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <CreditCardIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={cardDetails.cardNumber}
                          onChange={handleChange}
                          className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('payment.cardHolder')}
                      </label>
                      <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        value={cardDetails.cardHolder}
                        onChange={handleChange}
                        className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('payment.expiryDate')}
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={handleChange}
                          className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('payment.cvv')}
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={handleChange}
                          className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing || paymentStatus === 'success'}
                  className={`w-full bg-blue-700 text-white py-3 px-4 rounded-md font-medium ${
                    isProcessing || paymentStatus === 'success'
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:bg-blue-800'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري معالجة الدفع...
                    </span>
                  ) : paymentStatus === 'success' ? (
                    <span className="flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 ml-2" />
                      تم الدفع بنجاح
                    </span>
                  ) : (
                    t('payment.proceed')
                  )}
                </button>
                
                <div className="mt-4 text-center text-gray-500 text-sm">
                  <span className="flex items-center justify-center">
                    <LockClosedIcon className="h-4 w-4 ml-1" />
                    جميع المعاملات مشفرة وآمنة
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
