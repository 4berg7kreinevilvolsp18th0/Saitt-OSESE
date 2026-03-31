import type { Metadata } from 'next';
import GuideLayout from '../../../components/guides/GuideLayout';
import GuideSection from '../../../components/guides/GuideSection';
import GuideTable from '../../../components/guides/GuideTable';
import GuideCallout from '../../../components/guides/GuideCallout';
import GuideCTA from '../../../components/guides/GuideCTA';
import { getGuideBySlug } from '../../../lib/guides';

const meta = getGuideBySlug('infrastructure-deepdive')!;

export const metadata: Metadata = {
  title: `${meta.title} | ОСС ДВФУ`,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: 'article',
  },
};

export default function InfrastructureDeepdiveGuidePage() {
  return (
    <GuideLayout
      meta={meta}
      badges={['Демо-гайд', 'Расширенный']}
      summary="Расширенная версия: когда проблема не решается на базовом этапе и нужен понятный план эскалации."
      tocItems={[
        { id: 'levels', title: 'Уровни эскалации' },
        { id: 'template', title: 'Шаблон формулировки' },
        { id: 'matrix', title: 'Симптом → действие → канал' },
      ]}
    >
      <GuideSection id="levels" title="Уровни эскалации">
        <GuideTable
          headers={['Уровень', 'Куда передаем', 'Ожидаемый срок']}
          rows={[
            ['L1', 'Ответственные на месте', 'до 24 часов'],
            ['L2', 'Профильный блок ОСС', '1-3 рабочих дня'],
            ['L3', 'Административная эскалация', '3-7 рабочих дней'],
          ]}
        />
      </GuideSection>

      <GuideSection id="template" title="Шаблон формулировки">
        <GuideCallout variant="tip">
          <strong>Тема:</strong> Проблема инфраструктуры в корпусе [X], помещение [Y].
          <br />
          <strong>Описание:</strong> [что произошло], обнаружено [дата/время], влияет на
          [учебный процесс/условия проживания].
          <br />
          <strong>Что уже сделано:</strong> обращение к [ответственный], дата [..], ответ [..].
          <br />
          <strong>Просьба:</strong> зафиксировать обращение и сообщить следующий шаг с сроками.
        </GuideCallout>
      </GuideSection>

      <GuideSection id="matrix" title="Симптом → действие → канал">
        <ul className="space-y-3">
          <li className="rounded-xl border border-white/10 bg-white/5 p-4 light:bg-gray-50 light:border-gray-200">
            <strong>Нет отопления / воды:</strong> локальная фиксация + срочное сообщение в профильный
            канал ОСС.
          </li>
          <li className="rounded-xl border border-white/10 bg-white/5 p-4 light:bg-gray-50 light:border-gray-200">
            <strong>Проблемы доступа / безопасности:</strong> дежурные службы + параллельная передача
            в ОСС для контроля.
          </li>
          <li className="rounded-xl border border-white/10 bg-white/5 p-4 light:bg-gray-50 light:border-gray-200">
            <strong>Затяжной кейс:</strong> запуск эскалации L2/L3 с приложением хронологии.
          </li>
        </ul>
      </GuideSection>

      <GuideCTA
        slug={meta.slug}
        links={[
          { href: '/guides/infrastructure', label: 'Базовый гайд' },
          { href: '/content', label: 'Перейти в раздел контента', primary: true },
        ]}
      />
    </GuideLayout>
  );
}

