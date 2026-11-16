import { fireEvent, render, screen, within } from '@testing-library/react';
import Header from '../../components/Header';
import { LocaleProvider } from '../../components/LocaleProvider';

// Mock next/navigation исправленный
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('Header', () => {
  beforeEach(() => localStorage.clear());

  it('отображает компонент header', () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Новости и гайды' })).toBeInTheDocument();
  });
  it('переключает язык навигации без перезагрузки и сохраняет выбор', () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    const navigation = screen.getByRole('navigation', { name: 'Меню' });
    fireEvent.click(within(navigation).getByRole('button', { name: 'English' }));
    expect(within(navigation).getByRole('link', { name: 'News & Guides' })).toBeInTheDocument();
    expect(within(navigation).getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(localStorage.getItem('locale')).toBe('en');
  });
});
