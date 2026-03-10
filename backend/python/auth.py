"""
Supabase аутентификация и role-based авторизация для FastAPI.
"""
from typing import Any, Dict, Iterable, Optional, Tuple
from uuid import UUID
import os

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer


VALID_ROLES = {"member", "lead", "board", "staff"}
PRIVILEGED_ROLES = {"board", "staff"}

# Если токен отсутствует, вернем 401 сами с понятным текстом.
security = HTTPBearer(auto_error=False)


def _get_supabase_settings() -> Tuple[str, str]:
    """Возвращает обязательные настройки Supabase или бросает 503."""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
    if not supabase_url or not supabase_anon_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase is not configured",
        )
    return supabase_url.rstrip("/"), supabase_anon_key


def _normalize_uuid(value: Any, field_name: str = "id") -> UUID:
    """Нормализует UUID и возвращает 401 при невалидном значении."""
    try:
        return value if isinstance(value, UUID) else UUID(str(value))
    except (TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid {field_name} in token payload",
        ) from exc


async def verify_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Dict[str, Any]:
    """
    Проверяет Bearer JWT через Supabase и возвращает нормализованный профиль пользователя.
    """
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    token = credentials.credentials.strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Empty bearer token",
        )

    supabase_url, supabase_anon_key = _get_supabase_settings()

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{supabase_url}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": supabase_anon_key,
                },
            )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service is unavailable",
        ) from exc

    if response.status_code != status.HTTP_200_OK:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user_data = response.json()
    user_id = _normalize_uuid(user_data.get("id"), "user id")

    return {
        "id": user_id,
        "email": user_data.get("email"),
        "user_metadata": user_data.get("user_metadata") or {},
        "app_metadata": user_data.get("app_metadata") or {},
        "raw": user_data,
    }


async def get_current_user(user: Dict[str, Any] = Depends(verify_token)) -> Dict[str, Any]:
    """Возвращает текущего аутентифицированного пользователя."""
    return user


async def get_current_user_id(user: Dict[str, Any] = Depends(get_current_user)) -> UUID:
    """Возвращает UUID текущего пользователя."""
    return user["id"]


def check_role(
    user_id: UUID,
    required_role: str,
    direction_id: Optional[UUID] = None,
    db: Any = None,
) -> bool:
    """
    Проверяет, есть ли у пользователя требуемая роль.
    board/staff считаются привилегированными и проходят всегда.
    """
    if db is None or required_role not in VALID_ROLES:
        return False

    try:
        from crud import get_user_roles

        roles = get_user_roles(db, user_id)
        normalized_direction_id = _normalize_uuid(direction_id, "direction_id") if direction_id else None

        for role in roles:
            role_name = getattr(role, "role", None)
            if role_name in PRIVILEGED_ROLES:
                return True

            if role_name != required_role:
                continue

            # Глобальная роль (без направления) дает доступ везде для этой роли.
            role_direction = getattr(role, "direction_id", None)
            if normalized_direction_id is None or role_direction is None:
                return True
            if role_direction == normalized_direction_id:
                return True

        return False
    except Exception:
        return False


def has_any_role(
    user_id: UUID,
    required_roles: Iterable[str],
    direction_id: Optional[UUID] = None,
    db: Any = None,
) -> bool:
    """Проверяет наличие любой роли из списка."""
    for role in required_roles:
        if check_role(user_id=user_id, required_role=role, direction_id=direction_id, db=db):
            return True
    return False


def require_role(required_role: str, direction_id: Optional[UUID] = None):
    """
    FastAPI dependency: требует конкретную роль.

    Пример:
        @app.get("/admin/endpoint")
        def admin_endpoint(
            user: dict = Depends(require_role("board")),
            db: Session = Depends(get_db),
        ):
            ...
    """
    if required_role not in VALID_ROLES:
        raise ValueError(f"Unsupported role: {required_role}")

    from database import get_db
    from sqlalchemy.orm import Session

    def role_checker(
        user: Dict[str, Any] = Depends(get_current_user),
        db: Session = Depends(get_db),
    ):
        if not check_role(user["id"], required_role, direction_id, db):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires '{required_role}' role",
            )
        return user

    return role_checker


def require_any_role(required_roles: Iterable[str], direction_id: Optional[UUID] = None):
    """FastAPI dependency: требует любую роль из списка."""
    required_roles = tuple(required_roles)
    invalid_roles = [r for r in required_roles if r not in VALID_ROLES]
    if invalid_roles:
        raise ValueError(f"Unsupported roles: {', '.join(invalid_roles)}")

    from database import get_db
    from sqlalchemy.orm import Session

    def role_checker(
        user: Dict[str, Any] = Depends(get_current_user),
        db: Session = Depends(get_db),
    ):
        if not has_any_role(user["id"], required_roles, direction_id, db):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires one of roles: {', '.join(required_roles)}",
            )
        return user

    return role_checker

