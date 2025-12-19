"""
SQLAlchemy models for OSS DVFU database
"""
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Date, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base


class Direction(Base):
    """Direction/Committee model"""
    __tablename__ = "directions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    color_key = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    appeals = relationship("Appeal", back_populates="direction", cascade="all, delete-orphan")
    content = relationship("Content", back_populates="direction", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="direction", cascade="all, delete-orphan")
    user_roles = relationship("UserRole", back_populates="direction", cascade="all, delete-orphan")


class Appeal(Base):
    """Appeal model"""
    __tablename__ = "appeals"
    __table_args__ = (
        CheckConstraint("contact_type IN ('email', 'telegram')", name="check_contact_type"),
        CheckConstraint("status IN ('new', 'in_progress', 'waiting', 'closed')", name="check_appeal_status"),
        CheckConstraint("priority IN ('low', 'normal', 'high', 'urgent')", name="check_appeal_priority"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    direction_id = Column(UUID(as_uuid=True), ForeignKey("directions.id"), nullable=True)
    category = Column(String)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    institute = Column(String)
    is_anonymous = Column(Boolean, default=False)
    contact_type = Column(String)
    contact_value = Column(String)
    status = Column(String, nullable=False, default="new")
    public_token = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, index=True)
    deadline = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    first_response_at = Column(DateTime(timezone=True))
    closed_at = Column(DateTime(timezone=True))

    # Relationships
    direction = relationship("Direction", back_populates="appeals")
    comments = relationship("AppealComment", back_populates="appeal", cascade="all, delete-orphan")


class AppealComment(Base):
    """Appeal comment model"""
    __tablename__ = "appeal_comments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appeal_id = Column(UUID(as_uuid=True), ForeignKey("appeals.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(UUID(as_uuid=True))  # Supabase auth user ID
    message = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    appeal = relationship("Appeal", back_populates="comments")


class Content(Base):
    """Content model (news, guides, FAQ)"""
    __tablename__ = "content"
    __table_args__ = (
        CheckConstraint("type IN ('news', 'guide', 'faq')", name="check_content_type"),
        CheckConstraint("status IN ('draft', 'published', 'archived')", name="check_content_status"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    body = Column(Text, nullable=False)
    direction_id = Column(UUID(as_uuid=True), ForeignKey("directions.id"), nullable=True)
    status = Column(String, nullable=False, default="draft")
    published_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    direction = relationship("Direction", back_populates="content")


class Document(Base):
    """Document model"""
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    direction_id = Column(UUID(as_uuid=True), ForeignKey("directions.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    direction = relationship("Direction", back_populates="documents")


class UserRole(Base):
    """User role model"""
    __tablename__ = "user_roles"
    __table_args__ = (
        CheckConstraint("role IN ('member', 'lead', 'board', 'staff')", name="check_user_role"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)  # Supabase auth user ID
    role = Column(String, nullable=False)
    direction_id = Column(UUID(as_uuid=True), ForeignKey("directions.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    direction = relationship("Direction", back_populates="user_roles")

