import type { Metadata } from 'next';
import GuideLayout from '../../../components/guides/GuideLayout';
import GuideSection from '../../../components/guides/GuideSection';
import GuideCallout from '../../../components/guides/GuideCallout';
import GuideChecklist from '../../../components/guides/GuideChecklist';
import GuideCTA from '../../../components/guides/GuideCTA';
import { getGuideBySlug } from '../../../lib/guides';

const meta = getGuideBySlug('medical-service')!;

export const metadata: Metadata = {
  title: `${meta.title} | ОСС ДВФУ`,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: 'article',
  },
};

export default function MedicalServiceGuidePage() {
  return (
    <GuideLayout
      meta={meta}
      badges={['Инфраструктура', 'Гайд']}
      summary="Гайд по вопросам здоровья, прикреплению к поликлинике и медицинской помощи на кампусе."
      tocItems={[
        { id: 'why', title: 'Для чего это нужно' },
        { id: 'attach', title: 'Как прикрепиться' },
        { id: 'island', title: 'Если вы на острове' },
      ]}
    >
      <GuideSection id="why" title="Для чего это нужно">
        <p>Если вы прикреплены к поликлинике, обращение в рамках ОМС бесплатно.</p>
        <ul className="mt-2 list-disc pl-6 space-y-1">
          <li>экстренная и неотложная помощь;</li>
          <li>платная помощь;</li>
          <li>бесплатная помощь по полису ОМС.</li>
        </ul>
        <GuideCallout variant="important" colorKey={meta.colorKey}>
          Если вы не из Владивостока, заранее позаботьтесь о смене полиса ОМС на владивостокский.
        </GuideCallout>
      </GuideSection>

      <GuideSection id="attach" title="Как прикрепиться к поликлинике">
        <GuideChecklist
          title="Документы"
          items={['Паспорт/временное удостоверение', 'Полис ОМС или копия', 'Копия паспорта']}
        />
        <p className="mt-3">
          Заявление о прикреплении заполняется в регистратуре. Уведомление о принятии обычно
          приходит в течение месяца.
        </p>
        <GuideCallout variant="deadline" colorKey={meta.colorKey}>
          Менять лечебное учреждение можно 1 раз в год, исключение — переезд. Без прикрепления
          обычно доступны только экстренные сценарии.
        </GuideCallout>
      </GuideSection>

      <GuideSection id="island" title="Если вы на острове">
        <p>На кампусе работает университетская поликлиника (корпус 1.8).</p>
        <ul className="mt-2 list-disc pl-6 space-y-1">
          <li>терапевт, гинеколог, ЛОР, окулист;</li>
          <li>стоматолог, хирург, невролог, психиатр.</li>
        </ul>
        <p className="mt-2">
          Для первого обращения возьмите паспорт, полис и СНИЛС — вам оформят медкарту.
        </p>
      </GuideSection>

      <GuideCTA
        slug={meta.slug}
        links={[
          { href: '/content', label: 'Перейти в раздел контента', primary: true },
          { href: '/guides/infrastructure', label: 'Другие гайды по инфраструктуре' },
        ]}
      />
    </GuideLayout>
  );
}

