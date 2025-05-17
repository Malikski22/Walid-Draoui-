import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50" dir={t('common.direction', { defaultValue: 'rtl' })}>
      <div className="bg-blue-700 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            {t('footer.privacy')}
          </h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">مقدمة</h2>
            <p className="text-gray-700 mb-3">
              نحن في DzSmartBooking نلتزم بحماية خصوصيتك. تشرح هذه الوثيقة سياساتنا المتعلقة بجمع واستخدام والكشف عن المعلومات الشخصية التي نتلقاها من مستخدمي موقعنا.
            </p>
            <p className="text-gray-700">
              باستخدام موقعنا، فإنك توافق على جمع واستخدام المعلومات وفقًا لسياسة الخصوصية هذه. المعلومات الشخصية التي نجمعها تُستخدم فقط لتقديم وتحسين خدماتنا. لن نستخدم أو نشارك معلوماتك مع أي شخص إلا كما هو موضح في سياسة الخصوصية هذه.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">جمع المعلومات واستخدامها</h2>
            <p className="text-gray-700 mb-3">
              أثناء استخدامك لموقعنا، قد نطلب منك تزويدنا بمعلومات تعريف شخصية معينة يمكن استخدامها للاتصال بك أو تحديد هويتك. قد تتضمن المعلومات التي يمكن تحديد هويتك، على سبيل المثال لا الحصر، اسمك وعنوان بريدك الإلكتروني ورقم هاتفك وتاريخ ميلادك وعنوانك.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">نستخدم المعلومات التي نجمعها للأغراض التالية:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
              <li>لتوفير وصيانة موقعنا</li>
              <li>لإخطارك بالتغييرات على موقعنا أو الخدمات التي نقدمها</li>
              <li>للسماح لك بالمشاركة في الميزات التفاعلية لموقعنا عندما تختار القيام بذلك</li>
              <li>لتقديم دعم العملاء</li>
              <li>لجمع التحليلات أو المعلومات القيمة حتى نتمكن من تحسين موقعنا</li>
              <li>لمراقبة استخدام موقعنا</li>
              <li>لاكتشاف ومنع والتعامل مع المشاكل الفنية أو الاحتيال</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">أمن المعلومات</h2>
            <p className="text-gray-700 mb-3">
              أمن معلوماتك مهم بالنسبة لنا، ولكن تذكر أنه لا توجد طريقة نقل عبر الإنترنت أو طريقة تخزين إلكتروني آمنة بنسبة 100٪. في حين أننا نسعى جاهدين لاستخدام وسائل مقبولة تجاريًا لحماية معلوماتك الشخصية، لا يمكننا ضمان أمنها المطلق.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">ملفات تعريف الارتباط والتقنيات المماثلة</h2>
            <p className="text-gray-700 mb-3">
              يستخدم موقعنا "ملفات تعريف الارتباط" لجمع المعلومات وتحسين خدماتنا. ملفات تعريف الارتباط هي ملفات تحتوي على كمية صغيرة من البيانات التي قد تتضمن معرفًا فريدًا مجهول الهوية. يتم إرسال ملفات تعريف الارتباط إلى متصفحك من موقعنا وتخزينها على جهازك.
            </p>
            <p className="text-gray-700 mb-3">
              يمكنك توجيه متصفحك لرفض جميع ملفات تعريف الارتباط أو للإشارة عند إرسال ملف تعريف ارتباط. ومع ذلك، إذا كنت لا تقبل ملفات تعريف الارتباط، فقد لا تتمكن من استخدام بعض أجزاء من موقعنا.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">الإفصاح عن البيانات</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">قد نكشف عن معلوماتك الشخصية في الحالات التالية:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>للامتثال لالتزام قانوني</li>
              <li>لحماية حقوق أو ممتلكات DzSmartBooking</li>
              <li>لمنع أو التحقيق في مخالفات محتملة تتعلق بالخدمة</li>
              <li>لحماية السلامة الشخصية لمستخدمي الخدمة أو الجمهور</li>
              <li>للحماية من المسؤولية القانونية</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">روابط لمواقع أخرى</h2>
            <p className="text-gray-700">
              قد تحتوي خدمتنا على روابط لمواقع أخرى ليست مملوكة أو خاضعة لسيطرتنا. يرجى ملاحظة أننا لسنا مسؤولين عن ممارسات الخصوصية لهذه المواقع الأخرى. نحن نشجعك على أن تكون على علم عندما تغادر موقعنا وقراءة بيانات الخصوصية لكل موقع قد تجمع معلومات شخصية.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">التغييرات في سياسة الخصوصية هذه</h2>
            <p className="text-gray-700 mb-3">
              قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنخطرك بأي تغييرات عن طريق نشر سياسة الخصوصية الجديدة على هذه الصفحة ويمكن إرسال بريد إلكتروني إليك.
            </p>
            <p className="text-gray-700">
              ننصحك بمراجعة سياسة الخصوصية هذه بشكل دوري لأي تغييرات. التغييرات على سياسة الخصوصية هذه تكون فعالة عندما يتم نشرها على هذه الصفحة.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">اتصل بنا</h2>
            <p className="text-gray-700">
              إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى <a href="/contact" className="text-blue-700 hover:underline">الاتصال بنا</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
