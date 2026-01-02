#!/bin/bash
# Start script for Railway deployment
# Railway автоматически устанавливает зависимости через Nixpacks,
# этот скрипт нужен только если Railway не может определить команду запуска

# Запуск приложения
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers ${WORKERS:-2}

