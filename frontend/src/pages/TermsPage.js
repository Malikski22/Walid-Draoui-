import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50" dir={t('common.direction', { defaultValue: 'rtl' })}>
      <div className="bg-blue-700 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            {t('footer.terms')}
          </h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">مقدمة</h2>
            <p className="text-gray-700 mb-3">
              مرحبًا بك في منصة DzSmartBooking. تحدد هذه الشروط والأحكام القواعد والقوانين لاستخدام موقع DzSmartBooking الإلكتروني.
            </p>
            <p className="text-gray-700">
              باستخدام هذا الموقع، نفترض أنك تقبل هذه الشروط والأحكام بالكامل. إذا كنت لا توافق على هذه الشروط والأحكام، فيجب عليك التوقف عن استخدام هذا الموقع على الفور.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">الترخيص</h2>
            <p className="text-gray-700 mb-3">
              ما لم يُذكر خلاف ذلك، فإن DzSmartBooking و/أو مرخصيها يمتلكون الحقوق الفكرية لجميع المواد الموجودة على DzSmartBooking. جميع حقوق الملكية الفكرية محفوظة. يمكنك الوصول إلى هذا من DzSmartBooking للاستخدام الشخصي الخاص بك وفقًا للقيود المحددة في هذه الشروط والأحكام.
            </p>
            <p className="text-gray-700">
              يجب عليك عدم:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
              <li>إعادة نشر المواد من DzSmartBooking</li>
              <li>بيع أو تأجير أو ترخيص المواد من DzSmartBooking من الباطن</li>
              <li>إعادة إنتاج أو نسخ أو نسخ المواد من DzSmartBooking</li>
              <li>إعادة توزيع المحتوى من DzSmartBooking</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">حجوزات الفنادق</h2>
            <p className="text-gray-700 mb-3">
              تخضع جميع الحجوزات التي يتم إجراؤها من خلال موقعنا لسياسات الإلغاء والدفع الخاصة بالفنادق المعنية. يرجى مراجعة هذه السياسات بعناية قبل إجراء الحجز.
            </p>
            <p className="text-gray-700">
              نحن نعمل كوسيط بين العملاء والفنادق، ونبذل قصارى جهدنا لضمان دقة المعلومات المقدمة، ولكننا لا نتحمل المسؤولية عن أي عدم دقة أو إغفال في المعلومات المقدمة من الفنادق.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">حجوزات النقل</h2>
            <p className="text-gray-700 mb-3">
              تخضع جميع حجوزات النقل (الحافلات) لشروط وسياسات شركات النقل المعنية. نحن غير مسؤولين عن أي تأخير أو إلغاء أو مشاكل أخرى قد تحدث مع خدمات النقل.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">الدفع</h2>
            <p className="text-gray-700 mb-3">
              نحن نستخدم طرق دفع آمنة، ونلتزم بحماية معلومات بطاقتك الائتمانية. يرجى ملاحظة أن بعض الرسوم الإضافية قد تنطبق حسب طريقة الدفع المختارة.
            </p>
            <p className="text-gray-700">
              عند إتمام عملية الحجز والدفع، ستتلقى تأكيدًا بالبريد الإلكتروني. يرجى الاحتفاظ بهذا التأكيد كدليل على حجزك.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">إخلاء المسؤولية</h2>
            <p className="text-gray-700 mb-3">
              بقدر ما تسمح به القوانين المعمول بها، نستبعد جميع الإقرارات والضمانات والشروط المتعلقة بموقعنا واستخدام هذا الموقع. لا شيء في إخلاء المسؤولية هذا سوف:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
              <li>يحد أو يستبعد مسؤوليتنا عن الوفاة أو الإصابة الشخصية</li>
              <li>يحد أو يستبعد مسؤوليتنا عن الاحتيال أو التحريف الاحتيالي</li>
              <li>يحد أي من مسؤولياتنا بأي طريقة غير مسموح بها بموجب القانون المعمول به</li>
              <li>يستبعد أيًا من مسؤولياتنا التي قد لا تكون مستبعدة بموجب القانون المعمول به</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">التغييرات في الشروط</h2>
            <p className="text-gray-700 mb-3">
              نحن نحتفظ بالحق في تعديل هذه الشروط من وقت لآخر. من خلال استخدام موقعنا، فإنك توافق على الالتزام بالإصدار الحالي من هذه الشروط والأحكام.
            </p>
            <p className="text-gray-700">
              إذا كانت لديك أي أسئلة حول هذه الشروط والأحكام، يرجى <a href="/contact" className="text-blue-700 hover:underline">الاتصال بنا</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
