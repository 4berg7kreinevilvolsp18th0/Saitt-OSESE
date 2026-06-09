import { render, screen } from '@testing-library/react';
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
  it('отображает компонент header', () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument(); // проверяем что компонент header отображается
  });
});

