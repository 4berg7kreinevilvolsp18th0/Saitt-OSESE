FROM python:3.11-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Копирование файлов зависимостей
COPY requirements.txt .

# Установка Python зависимостей
RUN pip install --no-cache-dir -r requirements.txt

# Копирование кода приложения
COPY . .

# Переменные окружения (можно переопределить)
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Открытие порта
EXPOSE 8000

# Команда запуска
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 2

