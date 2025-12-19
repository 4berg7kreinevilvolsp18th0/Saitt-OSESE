"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID


# Direction schemas
class DirectionBase(BaseModel):
    slug: str
    title: str
    description: Optional[str] = None
    color_key: str
    is_active: bool = True


class DirectionCreate(DirectionBase):
    pass


class Direction(DirectionBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# Appeal schemas
class AppealBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=20)
    category: Optional[str] = None
    institute: Optional[str] = None
    is_anonymous: bool = False
    contact_type: str = Field(..., pattern="^(email|telegram)$")
    contact_value: str
    direction_id: Optional[UUID] = None


class AppealCreate(AppealBase):
    pass


class AppealUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(new|in_progress|waiting|closed)$")
    direction_id: Optional[UUID] = None
    priority: Optional[str] = Field(None, pattern="^(low|normal|high|urgent)$")
    tags: Optional[List[str]] = None
    deadline: Optional[date] = None
    assigned_to: Optional[UUID] = None
    first_response_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None


class Appeal(AppealBase):
    id: UUID
    status: str
    priority: Optional[str] = "normal"
    tags: Optional[List[str]] = None
    public_token: UUID
    deadline: Optional[date] = None
    assigned_to: Optional[UUID] = None
    created_at: datetime
    first_response_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    direction_id: Optional[UUID] = None

    class Config:
        from_attributes = True


class AppealPublic(BaseModel):
    """Public appeal info (only by token)"""
    id: UUID
    title: str
    status: str
    created_at: datetime
    closed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Appeal Comment schemas
class AppealCommentBase(BaseModel):
    message: str = Field(..., min_length=1)
    is_internal: bool = True


class AppealCommentCreate(AppealCommentBase):
    appeal_id: UUID


class AppealComment(AppealCommentBase):
    id: UUID
    appeal_id: UUID
    author_id: Optional[UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Content schemas
class ContentBase(BaseModel):
    type: str = Field(..., pattern="^(news|guide|faq)$")
    title: str
    slug: str
    body: str
    direction_id: Optional[UUID] = None
    status: str = Field(default="draft", pattern="^(draft|published|archived)$")


class ContentCreate(ContentBase):
    pass


class ContentUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(draft|published|archived)$")
    published_at: Optional[datetime] = None


class Content(ContentBase):
    id: UUID
    published_at: Optional[datetime] = None
    updated_at: datetime

    class Config:
        from_attributes = True


# Document schemas
class DocumentBase(BaseModel):
    title: str
    file_url: str
    direction_id: Optional[UUID] = None


class DocumentCreate(DocumentBase):
    pass


class Document(DocumentBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# User Role schemas
class UserRoleBase(BaseModel):
    user_id: UUID
    role: str = Field(..., pattern="^(member|lead|board|staff)$")
    direction_id: Optional[UUID] = None


class UserRoleCreate(UserRoleBase):
    pass


class UserRole(UserRoleBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Statistics schemas
class AppealStats(BaseModel):
    total: int
    by_status: dict
    by_direction: dict
    created_today: int
    closed_today: int


# Response schemas
class MessageResponse(BaseModel):
    message: str


class TokenResponse(BaseModel):
    public_token: UUID


# Appeal Attachment schemas
class AppealAttachmentBase(BaseModel):
    file_name: str
    file_url: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None


class AppealAttachmentCreate(AppealAttachmentBase):
    appeal_id: UUID


class AppealAttachment(AppealAttachmentBase):
    id: UUID
    appeal_id: UUID
    uploaded_at: datetime

    class Config:
        from_attributes = True

