"""
Full-text search functionality for appeals and content
"""
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional
from uuid import UUID
from models import Appeal, Content


def search_appeals(
    db: Session,
    query: str,
    direction_id: Optional[UUID] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Appeal]:
    """
    Full-text search in appeals by title, description, and tags
    """
    # Защита от SQL injection: ограничение длины и экранирование
    # SQLAlchemy автоматически экранирует, но на всякий случай
    if len(query) > 200:
        query = query[:200]  # Ограничение длины запроса
    
    # Экранирование специальных символов для LIKE (SQLAlchemy делает это автоматически)
    # Но для дополнительной безопасности
    query = query.replace('%', '\\%').replace('_', '\\_')
    
    search_filter = or_(
        Appeal.title.ilike(f"%{query}%"),
        Appeal.description.ilike(f"%{query}%"),
        Appeal.category.ilike(f"%{query}%"),
        Appeal.institute.ilike(f"%{query}%"),
        Appeal.contact_value.ilike(f"%{query}%"),
    )
    
    # PostgreSQL array search (if tags contain query)
    # Note: This is a simple implementation. For better performance, use PostgreSQL full-text search
    db_query = db.query(Appeal).filter(search_filter)
    
    if direction_id:
        db_query = db_query.filter(Appeal.direction_id == direction_id)
    if status:
        db_query = db_query.filter(Appeal.status == status)
    
    return db_query.order_by(Appeal.created_at.desc()).offset(skip).limit(limit).all()


def search_content(
    db: Session,
    query: str,
    content_type: Optional[str] = None,
    direction_id: Optional[UUID] = None,
    published_only: bool = True,
    skip: int = 0,
    limit: int = 100
) -> List[Content]:
    """
    Full-text search in content by title and body
    """
    search_filter = or_(
        Content.title.ilike(f"%{query}%"),
        Content.body.ilike(f"%{query}%"),
    )
    
    db_query = db.query(Content).filter(search_filter)
    
    if content_type:
        db_query = db_query.filter(Content.type == content_type)
    if direction_id:
        db_query = db_query.filter(Content.direction_id == direction_id)
    if published_only:
        db_query = db_query.filter(Content.status == "published")
    
    return db_query.order_by(Content.published_at.desc()).offset(skip).limit(limit).all()


def search_appeals_by_tags(
    db: Session,
    tags: List[str],
    skip: int = 0,
    limit: int = 100
) -> List[Appeal]:
    """
    Search appeals by tags (PostgreSQL array contains)
    """
    # PostgreSQL array overlap operator
    from sqlalchemy.dialects.postgresql import array
    db_query = db.query(Appeal).filter(
        Appeal.tags.overlap(tags)
    )
    
    return db_query.order_by(Appeal.created_at.desc()).offset(skip).limit(limit).all()

