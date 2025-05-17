import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50" dir={t('common.direction', { defaultValue: 'rtl' })}>
      <div className="bg-blue-700 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            {t('aboutUs.title')}
          </h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              {t('aboutUs.mission')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              نحن في DzSmartBooking نسعى لتوفير منصة حجز سهلة الاستخدام وموثوقة للمسافرين في الجزائر. مهمتنا هي تبسيط عملية البحث والحجز للفنادق والشقق المفروشة وتذاكر الحافلات، من خلال توفير معلومات شاملة وأسعار شفافة ودعم ممتاز للعملاء.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              {t('aboutUs.vision')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              نتطلع لأن نصبح المنصة الرائدة للحجوزات السياحية في الجزائر، من خلال الابتكار المستمر وتقديم تجربة مستخدم استثنائية. نؤمن بأن السفر يجب أن يكون ممتعًا من لحظة البدء بالتخطيط، ونعمل جاهدين لتحقيق ذلك لكل مسافر.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              {t('aboutUs.story')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              تأسست DzSmartBooking في عام 2023 على يد مجموعة من رواد الأعمال الجزائريين الذين لاحظوا الحاجة إلى منصة حجز متكاملة تخدم احتياجات السوق المحلي.
            </p>
            <p className="text-gray-700 leading-relaxed">
              بدأنا بالتركيز على حجز الفنادق، ثم توسعنا لنشمل خدمات حجز تذاكر الحافلات والشقق المفروشة، مع الالتزام الدائم بتقديم أفضل تجربة للمستخدمين.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              {t('aboutUs.values')}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><span className="font-medium">الموثوقية:</span> نلتزم بتقديم معلومات دقيقة وخدمات يمكن الاعتماد عليها.</li>
              <li><span className="font-medium">الشفافية:</span> نؤمن بعرض الأسعار والشروط بشكل واضح دون رسوم خفية.</li>
              <li><span className="font-medium">سهولة الاستخدام:</span> نصمم منصتنا لتكون بديهية وسهلة الاستخدام لجميع المستخدمين.</li>
              <li><span className="font-medium">خدمة العملاء:</span> نوفر دعمًا ممتازًا للعملاء قبل وأثناء وبعد الحجز.</li>
              <li><span className="font-medium">الابتكار:</span> نسعى دائمًا لتحسين خدماتنا وإضافة ميزات جديدة تلبي احتياجات المستخدمين.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              {t('aboutUs.team')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              يضم فريقنا مجموعة من المتخصصين المهرة في مجالات تكنولوجيا المعلومات، والسياحة، وخدمة العملاء، وتطوير الأعمال. نعمل معًا لتحقيق رؤيتنا المشتركة لتحسين تجربة السفر في الجزائر.
            </p>
            <p className="text-gray-700 leading-relaxed">
              إذا كنت ترغب في التواصل معنا أو الانضمام إلى فريقنا، يرجى زيارة صفحة <a href="/contact" className="text-blue-700 hover:underline">اتصل بنا</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
