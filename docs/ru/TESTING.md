# Тестирование

**Дата:** 2024-12-19  
**Статус:** ✅ Базовая структура создана

---

## 📋 Структура тестов

### Backend (Python/pytest)

```
backend/python/
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Фикстуры и конфигурация
│   ├── test_health.py       # Тесты health checks
│   ├── test_crud.py         # Тесты CRUD операций
│   └── test_api.py          # Тесты API endpoints
└── pytest.ini              # Конфигурация pytest
```

### Frontend (Next.js/Jest)

```
frontend/nextjs/
├── __tests__/
│   ├── api/
│   │   └── health.test.ts
│   └── components/
│       └── Header.test.tsx
├── jest.config.js           # Конфигурация Jest
└── jest.setup.js            # Настройка тестовой среды
```

---

## 🚀 Запуск тестов

### Backend

```bash
cd backend/python

# Установить зависимости
pip install -r requirements.txt

# Запустить все тесты
pytest

# С покрытием кода
pytest --cov=. --cov-report=html

# Конкретный тест
pytest tests/test_health.py

# С маркерами
pytest -m unit
pytest -m integration
```

### Frontend

```bash
cd frontend/nextjs

# Установить зависимости
npm install

# Запустить все тесты
npm test

# В режиме watch
npm run test:watch

# С покрытием кода
npm run test:coverage
```

---

## 📊 Покрытие кода

### Backend

```bash
# Генерация отчета
pytest --cov=. --cov-report=html

# Отчет будет в htmlcov/index.html
```

### Frontend

```bash
# Генерация отчета
npm run test:coverage

# Отчет будет в coverage/lcov-report/index.html
```

---

## 🧪 Типы тестов

### Unit тесты

Тестируют отдельные функции и методы:

```python
# backend/python/tests/test_crud.py
def test_create_direction(db, sample_direction_data):
    direction = create_direction(db, DirectionCreate(**sample_direction_data))
    assert direction.id is not None
```

### Integration тесты

Тестируют взаимодействие компонентов:

```python
# backend/python/tests/test_api.py
def test_create_appeal(client, sample_appeal_data):
    response = client.post("/api/appeals", json=sample_appeal_data)
    assert response.status_code == 201
```

### E2E тесты (будущее)

Тестируют полный пользовательский сценарий (Playwright):

```typescript
// e2e/appeals.spec.ts
test('user can create appeal', async ({ page }) => {
  await page.goto('/appeal');
  await page.fill('input[name="title"]', 'Test Appeal');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success')).toBeVisible();
});
```

---

## 🔧 Фикстуры

### Backend (pytest)

```python
# conftest.py
@pytest.fixture
def db():
    """Создает тестовую БД"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db):
    """Создает тестовый клиент"""
    app.dependency_overrides[get_db] = lambda: db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()
```

### Frontend (Jest)

```javascript
// jest.setup.js
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
```

---

## 📝 Написание тестов

### Backend

```python
def test_get_appeal_by_token(client, sample_appeal_data):
    """Test getting an appeal by public token"""
    # Arrange
    create_response = client.post("/api/appeals", json=sample_appeal_data)
    token = create_response.json()["public_token"]
    
    # Act
    response = client.get(f"/api/appeals/token/{token}")
    
    # Assert
    assert response.status_code == 200
    assert response.json()["public_token"] == token
```

### Frontend

```typescript
import { render, screen } from '@testing-library/react';
import Component from '../Component';

test('renders component', () => {
  render(<Component />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

---

## 🎯 Best Practices

### 1. Именование

- Тесты должны быть описательными
- Используйте `test_` или `describe` для группировки
- Название должно описывать что тестируется

### 2. Структура (AAA)

```python
def test_example():
    # Arrange - подготовка
    data = {"key": "value"}
    
    # Act - действие
    result = function(data)
    
    # Assert - проверка
    assert result == expected
```

### 3. Изоляция

- Каждый тест должен быть независимым
- Используйте фикстуры для подготовки данных
- Очищайте данные после теста

### 4. Покрытие

- Стремитесь к 80%+ покрытию
- Тестируйте критичные пути
- Не гонитесь за 100% (это может быть избыточно)

---

## 🚨 CI/CD

Тесты автоматически запускаются в GitHub Actions:

- При каждом push в main/master/develop
- При создании Pull Request
- Вручную через workflow_dispatch

**Workflow:** `.github/workflows/tests.yml`

---

## 📈 Метрики

### Текущее покрытие:

- **Backend:** ~30% (базовые тесты)
- **Frontend:** ~10% (базовые тесты)

### Цели:

- **Backend:** 70%+ покрытие
- **Frontend:** 60%+ покрытие
- **E2E:** Критичные сценарии

---

## 🔄 Добавление новых тестов

### Backend

1. Создайте файл `tests/test_*.py`
2. Импортируйте необходимые фикстуры
3. Напишите тесты
4. Запустите: `pytest tests/test_*.py`

### Frontend

1. Создайте файл `__tests__/**/*.test.ts(x)`
2. Импортируйте компоненты/функции
3. Напишите тесты
4. Запустите: `npm test`

---

## 🐛 Отладка тестов

### Backend

```bash
# С подробным выводом
pytest -v -s

# Остановка на первой ошибке
pytest -x

# Запуск только упавших тестов
pytest --lf
```

### Frontend

```bash
# С подробным выводом
npm test -- --verbose

# В режиме watch
npm run test:watch
```

---

## 📚 Ресурсы

- [pytest документация](https://docs.pytest.org/)
- [Jest документация](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)

---

**Тестирование настроено!** 🎉

