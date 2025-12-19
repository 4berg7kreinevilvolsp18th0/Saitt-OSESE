"""
CRUD operations for database models
"""
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date
from models import (
    Direction, Appeal, AppealComment, Content, Document, UserRole, AppealAttachment
)
from schemas import (
    DirectionCreate, AppealCreate, AppealUpdate, AppealCommentCreate,
    ContentCreate, ContentUpdate, DocumentCreate, UserRoleCreate,
    AppealAttachmentCreate
)


# Direction CRUD
def get_direction(db: Session, direction_id: UUID) -> Optional[Direction]:
    return db.query(Direction).filter(Direction.id == direction_id).first()


def get_direction_by_slug(db: Session, slug: str) -> Optional[Direction]:
    return db.query(Direction).filter(Direction.slug == slug).first()


def get_directions(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[Direction]:
    query = db.query(Direction)
    if active_only:
        query = query.filter(Direction.is_active == True)
    return query.offset(skip).limit(limit).all()


def create_direction(db: Session, direction: DirectionCreate) -> Direction:
    db_direction = Direction(**direction.dict())
    db.add(db_direction)
    db.commit()
    db.refresh(db_direction)
    return db_direction


# Appeal CRUD
def get_appeal(db: Session, appeal_id: UUID) -> Optional[Appeal]:
    return db.query(Appeal).filter(Appeal.id == appeal_id).first()


def get_appeal_by_token(db: Session, token: UUID) -> Optional[Appeal]:
    return db.query(Appeal).filter(Appeal.public_token == token).first()


def get_appeals(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    direction_id: Optional[UUID] = None,
) -> List[Appeal]:
    query = db.query(Appeal)
    if direction_id:
        query = query.filter(Appeal.direction_id == direction_id)
    if status:
        query = query.filter(Appeal.status == status)
    return query.order_by(Appeal.created_at.desc()).offset(skip).limit(limit).all()


def create_appeal(db: Session, appeal: AppealCreate) -> Appeal:
    db_appeal = Appeal(**appeal.dict())
    db.add(db_appeal)
    db.commit()
    db.refresh(db_appeal)
    return db_appeal


def update_appeal(db: Session, appeal_id: UUID, appeal_update: AppealUpdate) -> Optional[Appeal]:
    db_appeal = get_appeal(db, appeal_id)
    if not db_appeal:
        return None

    update_data = appeal_update.dict(exclude_unset=True)
    
    # Auto-set timestamps
    if update_data.get("status") == "closed" and not db_appeal.closed_at:
        update_data["closed_at"] = datetime.now()
    elif update_data.get("status") == "in_progress" and not db_appeal.first_response_at:
        update_data["first_response_at"] = datetime.now()

    for key, value in update_data.items():
        setattr(db_appeal, key, value)

    db.commit()
    db.refresh(db_appeal)
    return db_appeal


def get_appeal_stats(db: Session) -> dict:
    """Get appeal statistics"""
    total = db.query(func.count(Appeal.id)).scalar()
    
    by_status = {}
    for status in ["new", "in_progress", "waiting", "closed"]:
        count = db.query(func.count(Appeal.id)).filter(Appeal.status == status).scalar()
        by_status[status] = count

    by_direction = {}
    results = db.query(
        Appeal.direction_id,
        func.count(Appeal.id).label("count")
    ).group_by(Appeal.direction_id).all()
    
    for direction_id, count in results:
        key = str(direction_id) if direction_id else "other"
        by_direction[key] = count

    today = date.today()
    created_today = db.query(func.count(Appeal.id)).filter(
        func.date(Appeal.created_at) == today
    ).scalar()
    
    closed_today = db.query(func.count(Appeal.id)).filter(
        and_(
            Appeal.status == "closed",
            func.date(Appeal.closed_at) == today
        )
    ).scalar()

    return {
        "total": total,
        "by_status": by_status,
        "by_direction": by_direction,
        "created_today": created_today,
        "closed_today": closed_today,
    }


# Appeal Comment CRUD
def get_appeal_comments(db: Session, appeal_id: UUID) -> List[AppealComment]:
    return db.query(AppealComment).filter(AppealComment.appeal_id == appeal_id).order_by(AppealComment.created_at).all()


def create_appeal_comment(db: Session, comment: AppealCommentCreate, author_id: Optional[UUID] = None) -> AppealComment:
    db_comment = AppealComment(**comment.dict(), author_id=author_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


# Content CRUD
def get_content(db: Session, content_id: UUID) -> Optional[Content]:
    return db.query(Content).filter(Content.id == content_id).first()


def get_content_by_slug(db: Session, slug: str) -> Optional[Content]:
    return db.query(Content).filter(Content.slug == slug).first()


def get_contents(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    content_type: Optional[str] = None,
    direction_id: Optional[UUID] = None,
    published_only: bool = False
) -> List[Content]:
    query = db.query(Content)
    if content_type:
        query = query.filter(Content.type == content_type)
    if direction_id:
        query = query.filter(Content.direction_id == direction_id)
    if published_only:
        query = query.filter(Content.status == "published")
    return query.order_by(Content.published_at.desc()).offset(skip).limit(limit).all()


def create_content(db: Session, content: ContentCreate) -> Content:
    db_content = Content(**content.dict())
    if db_content.status == "published" and not db_content.published_at:
        db_content.published_at = datetime.now()
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    return db_content


def update_content(db: Session, content_id: UUID, content_update: ContentUpdate) -> Optional[Content]:
    db_content = get_content(db, content_id)
    if not db_content:
        return None

    update_data = content_update.dict(exclude_unset=True)
    if update_data.get("status") == "published" and not db_content.published_at:
        update_data["published_at"] = datetime.now()

    for key, value in update_data.items():
        setattr(db_content, key, value)

    db.commit()
    db.refresh(db_content)
    return db_content


# Document CRUD
def get_documents(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    direction_id: Optional[UUID] = None
) -> List[Document]:
    query = db.query(Document)
    if direction_id:
        query = query.filter(Document.direction_id == direction_id)
    return query.order_by(Document.created_at.desc()).offset(skip).limit(limit).all()


def create_document(db: Session, document: DocumentCreate) -> Document:
    db_document = Document(**document.dict())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document


# User Role CRUD
def get_user_roles(db: Session, user_id: UUID) -> List[UserRole]:
    return db.query(UserRole).filter(UserRole.user_id == user_id).all()


def create_user_role(db: Session, user_role: UserRoleCreate) -> UserRole:
    db_role = UserRole(**user_role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role


def delete_user_role(db: Session, role_id: UUID) -> bool:
    db_role = db.query(UserRole).filter(UserRole.id == role_id).first()
    if not db_role:
        return False
    db.delete(db_role)
    db.commit()
    return True

