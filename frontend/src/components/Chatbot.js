import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const Chatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'مرحباً! أنا المساعد الذكي لـ DzSmartBooking. كيف يمكنني مساعدتك اليوم؟', 
      isBot: true 
    }
  ]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: message,
      isBot: false
    };
    
    setMessages([...messages, userMessage]);
    setMessage('');
    
    // Simulate bot response - would be replaced with actual backend API call
    setTimeout(() => {
      let botResponse;
      
      // Simple rule-based responses for MVP
      if (message.toLowerCase().includes('فندق') || message.toLowerCase().includes('hotel')) {
        botResponse = 'يمكنك البحث عن الفنادق باستخدام شريط البحث في الأعلى. حدد المدينة وتاريخ وصولك ومغادرتك وعدد الضيوف.';
      } else if (message.toLowerCase().includes('حجز') || message.toLowerCase().includes('booking')) {
        botResponse = 'لإتمام الحجز، اختر الفندق المناسب، ثم الغرفة، وأكمل بيانات الحجز والدفع. ستتلقى تأكيد الحجز عبر البريد الإلكتروني.';
      } else if (message.toLowerCase().includes('إلغاء') || message.toLowerCase().includes('cancel')) {
        botResponse = 'يمكنك إلغاء الحجز من صفحة "حجوزاتي". تطبق سياسة الإلغاء الخاصة بكل فندق.';
      } else if (message.toLowerCase().includes('دفع') || message.toLowerCase().includes('payment')) {
        botResponse = 'نحن نقبل بطاقات الائتمان/الخصم. في المستقبل، سندعم طرق دفع محلية مثل CIB وEdahabia.';
      } else {
        botResponse = 'شكرًا على تواصلك. هل يمكنني مساعدتك في البحث عن الفنادق أو إتمام حجز؟';
      }
      
      const botMessageObj = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true
      };
      
      setMessages(prevMessages => [...prevMessages, botMessageObj]);
    }, 1000);
  };

  const handleSuggestion = (suggestion) => {
    setMessage(suggestion);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 mb-4" dir="rtl">
          <div className="bg-blue-700 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">{t('chatbot.title')}</h3>
            <button 
              onClick={toggleChatbot}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 h-80 overflow-y-auto">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-3 ${msg.isBot ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block rounded-lg py-2 px-3 max-w-xs ${
                    msg.isBot 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <div className="mb-2 overflow-x-auto whitespace-nowrap pb-2">
              <button 
                onClick={() => handleSuggestion(t('chatbot.suggestions.hotels'))}
                className="ml-2 mb-2 inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full py-1 px-3"
              >
                {t('chatbot.suggestions.hotels')}
              </button>
              <button 
                onClick={() => handleSuggestion(t('chatbot.suggestions.booking'))}
                className="ml-2 mb-2 inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full py-1 px-3"
              >
                {t('chatbot.suggestions.booking')}
              </button>
              <button 
                onClick={() => handleSuggestion(t('chatbot.suggestions.cancellation'))}
                className="ml-2 mb-2 inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full py-1 px-3"
              >
                {t('chatbot.suggestions.cancellation')}
              </button>
            </div>
            
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('chatbot.placeholder')}
                className="flex-grow rounded-l-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-700 text-white rounded-r-lg px-4 py-2 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
      
      <button
        onClick={toggleChatbot}
        className="bg-blue-700 text-white rounded-full p-3 shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Chatbot;
