import type { Metadata } from 'next';
import GuideLayout from '../../../components/guides/GuideLayout';
import GuideSection from '../../../components/guides/GuideSection';
import GuideCallout from '../../../components/guides/GuideCallout';
import GuideCTA from '../../../components/guides/GuideCTA';
import { getGuideBySlug } from '../../../lib/guides';

const meta = getGuideBySlug('infrastructure')!;

export const metadata: Metadata = {
  title: `${meta.title} | ОСС ДВФУ`,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: 'article',
  },
};

export default function InfrastructureGuidePage() {
  return (
    <GuideLayout
      meta={meta}
      badges={['Демо-гайд', 'Инфраструктура']}
      summary="Короткий сценарий для ситуаций с общежитием, аудиториями, бытовыми условиями и инфраструктурой кампуса."
      tocItems={[
        { id: 'when', title: 'Когда использовать' },
        { id: 'prepare', title: 'Что подготовить' },
        { id: 'steps', title: 'Пошаговый маршрут' },
      ]}
    >
      <GuideSection id="when" title="Когда использовать этот гайд">
        <ul className="list-disc pl-6 space-y-2">
          <li>Не работает оборудование в корпусе или общежитии.</li>
          <li>Есть вопросы по санитарному состоянию, доступности, безопасности.</li>
          <li>Нужна понятная маршрутизация: куда писать сначала, а куда эскалировать потом.</li>
        </ul>
      </GuideSection>

      <GuideSection id="prepare" title="Что подготовить заранее">
        <ol className="list-decimal pl-6 space-y-2">
          <li>Точный адрес, корпус, этаж, номер комнаты/аудитории.</li>
          <li>Фото или короткое видео проблемы.</li>
          <li>Дата и время обнаружения.</li>
          <li>Краткое описание: что не работает и как это влияет на учебу/проживание.</li>
          <li>Контакт для обратной связи.</li>
        </ol>
      </GuideSection>

      <GuideSection id="steps" title="Пошаговый маршрут">
        <div className="space-y-3">
          <GuideCallout variant="tip">
            <strong>Шаг 1. Локальная фиксация:</strong> сообщите проблему ответственному на месте и
            зафиксируйте, кому и когда передали информацию.
          </GuideCallout>
          <GuideCallout variant="important">
            <strong>Шаг 2. Передача в ОСС:</strong> отправьте структурированное описание в каналы ОСС
            и приложите материалы.
          </GuideCallout>
          <GuideCallout variant="deadline">
            <strong>Шаг 3. Контроль статуса:</strong> если срок превышен, запускайте эскалацию по
            расширенному гайду.
          </GuideCallout>
        </div>
      </GuideSection>

      <GuideCTA
        slug={meta.slug}
        links={[
          { href: '/guides/infrastructure-deepdive', label: 'Открыть расширенный гайд', primary: true },
          { href: '/content', label: 'Вернуться к контенту' },
        ]}
      />
    </GuideLayout>
  );
}

