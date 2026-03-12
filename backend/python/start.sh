#!/bin/bash
# Запуск   скрипта для Railway deployment (например, uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers ${WORKERS:-2})
# Railway автоматически устанавливает зависимости через Nixpacks,
# этот скрипт нужен только если Railway не может определить команду запуска (например, uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers ${WORKERS:-2})

# Запуск приложения (например, uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers ${WORKERS:-2})
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers ${WORKERS:-2}
