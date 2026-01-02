# Быстрое развертывание бэкенда

## 🚀 Railway (5 минут)

1. Зайдите на [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Выберите репозиторий
4. Настройки:
   - **Root Directory:** `backend/python`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`
5. **+ New** → **Database** → **Add PostgreSQL**
6. **Variables** → Добавьте:
