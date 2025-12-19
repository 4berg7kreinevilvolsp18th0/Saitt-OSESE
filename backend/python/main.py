"""
FastAPI application for OSS DVFU backend
"""
from fastapi import FastAPI, Depends, HTTPException, status, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from datetime import date
import crud
import search
import export
import analytics
from middleware import setup_rate_limiting, logging_middleware, limiter

from database import get_db, engine, Base
from models import Appeal, Direction, Content, Document, AppealAttachment
from errors import (
    AppealNotFoundError, AttachmentNotFoundError,
    appeal_not_found_handler, attachment_not_found_handler
)
from schemas import (
    AppealCreate, Appeal, AppealUpdate, AppealPublic, TokenResponse,
    AppealCommentCreate, AppealComment,
    ContentCreate, Content, ContentUpdate,
    DocumentCreate, Document,
    Direction, DirectionCreate,
    UserRoleCreate, UserRole,
    AppealStats, MessageResponse,
    AppealAttachmentCreate, AppealAttachment
)
import crud

# Create tables (in production, use migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OSS DVFU API",
    description="Backend API for OSS DVFU website",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Register error handlers
app.add_exception_handler(AppealNotFoundError, appeal_not_found_handler)
app.add_exception_handler(AttachmentNotFoundError, attachment_not_found_handler)

# CORS middleware
import os
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check
@app.get("/health")
async def health_check():
    return {"status": "ok"}


# ==================== Directions ====================

@app.get("/api/directions", response_model=List[Direction])
def get_directions(
    active_only: bool = Query(True),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get all directions"""
    return crud.get_directions(db, skip=skip, limit=limit, active_only=active_only)


@app.get("/api/directions/{direction_id}", response_model=Direction)
def get_direction(direction_id: UUID, db: Session = Depends(get_db)):
    """Get direction by ID"""
    direction = crud.get_direction(db, direction_id)
    if not direction:
        raise HTTPException(status_code=404, detail="Direction not found")
    return direction


@app.get("/api/directions/slug/{slug}", response_model=Direction)
def get_direction_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get direction by slug"""
    direction = crud.get_direction_by_slug(db, slug)
    if not direction:
        raise HTTPException(status_code=404, detail="Direction not found")
    return direction


# ==================== Appeals ====================

@app.post("/api/appeals", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def create_appeal(appeal: AppealCreate, db: Session = Depends(get_db)):
    """Create a new appeal (public endpoint)"""
    db_appeal = crud.create_appeal(db, appeal)
    return TokenResponse(public_token=db_appeal.public_token)


@app.get("/api/appeals/token/{token}", response_model=AppealPublic)
def get_appeal_by_token(token: UUID, db: Session = Depends(get_db)):
    """Get appeal by public token (public endpoint)"""
    appeal = crud.get_appeal_by_token(db, token)
    if not appeal:
        raise HTTPException(status_code=404, detail="Appeal not found")
    return appeal


@app.get("/api/appeals", response_model=List[Appeal])
def get_appeals(
    direction_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None, pattern="^(new|in_progress|waiting|closed)$"),
    priority: Optional[str] = Query(None, pattern="^(low|normal|high|urgent)$"),
    assigned_to: Optional[UUID] = Query(None),
    overdue_only: bool = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get appeals (admin endpoint - requires auth in production)"""
    if overdue_only:
        return crud.get_overdue_appeals(db, skip=skip, limit=limit)
    return crud.get_appeals(
        db, 
        skip=skip, 
        limit=limit, 
        direction_id=direction_id, 
        status=status,
        priority=priority,
        assigned_to=assigned_to
    )


@app.get("/api/appeals/{appeal_id}", response_model=Appeal)
def get_appeal(appeal_id: UUID, db: Session = Depends(get_db)):
    """Get appeal by ID (admin endpoint)"""
    appeal = crud.get_appeal(db, appeal_id)
    if not appeal:
        raise HTTPException(status_code=404, detail="Appeal not found")
    return appeal


@app.patch("/api/appeals/{appeal_id}", response_model=Appeal)
def update_appeal(
    appeal_id: UUID,
    appeal_update: AppealUpdate,
    db: Session = Depends(get_db)
):
    """Update appeal (admin endpoint)"""
    appeal = crud.update_appeal(db, appeal_id, appeal_update)
    if not appeal:
        raise HTTPException(status_code=404, detail="Appeal not found")
    return appeal


@app.get("/api/appeals/stats/summary", response_model=AppealStats)
def get_appeal_stats(db: Session = Depends(get_db)):
    """Get appeal statistics (admin endpoint)"""
    stats = crud.get_appeal_stats(db)
    return AppealStats(**stats)


# ==================== Appeal Comments ====================

@app.get("/api/appeals/{appeal_id}/comments", response_model=List[AppealComment])
def get_appeal_comments(appeal_id: UUID, db: Session = Depends(get_db)):
    """Get comments for an appeal (admin endpoint)"""
    return crud.get_appeal_comments(db, appeal_id)


@app.post("/api/appeals/{appeal_id}/comments", response_model=AppealComment, status_code=status.HTTP_201_CREATED)
def create_appeal_comment(
    appeal_id: UUID,
    comment: AppealCommentCreate,
    db: Session = Depends(get_db)
    # In production, add: current_user: User = Depends(get_current_user)
):
    """Create a comment on an appeal (admin endpoint)"""
    comment.appeal_id = appeal_id
    # In production: comment.author_id = current_user.id
    return crud.create_appeal_comment(db, comment)


# ==================== Content ====================

@app.get("/api/content", response_model=List[Content])
def get_contents(
    type: Optional[str] = Query(None, pattern="^(news|guide|faq)$"),
    direction_id: Optional[UUID] = Query(None),
    published_only: bool = Query(True),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get content items"""
    return crud.get_contents(
        db,
        skip=skip,
        limit=limit,
        content_type=type,
        direction_id=direction_id,
        published_only=published_only
    )


@app.get("/api/content/{content_id}", response_model=Content)
def get_content(content_id: UUID, db: Session = Depends(get_db)):
    """Get content by ID"""
    content = crud.get_content(db, content_id)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content


@app.get("/api/content/slug/{slug}", response_model=Content)
def get_content_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get content by slug"""
    content = crud.get_content_by_slug(db, slug)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content


@app.post("/api/content", response_model=Content, status_code=status.HTTP_201_CREATED)
def create_content(content: ContentCreate, db: Session = Depends(get_db)):
    """Create content (admin endpoint)"""
    return crud.create_content(db, content)


@app.patch("/api/content/{content_id}", response_model=Content)
def update_content(
    content_id: UUID,
    content_update: ContentUpdate,
    db: Session = Depends(get_db)
):
    """Update content (admin endpoint)"""
    content = crud.update_content(db, content_id, content_update)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content


# ==================== Documents ====================

@app.get("/api/documents", response_model=List[Document])
def get_documents(
    direction_id: Optional[UUID] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get documents"""
    return crud.get_documents(db, skip=skip, limit=limit, direction_id=direction_id)


@app.post("/api/documents", response_model=Document, status_code=status.HTTP_201_CREATED)
def create_document(document: DocumentCreate, db: Session = Depends(get_db)):
    """Create document (admin endpoint)"""
    return crud.create_document(db, document)


# ==================== User Roles ====================

@app.get("/api/users/{user_id}/roles", response_model=List[UserRole])
def get_user_roles(user_id: UUID, db: Session = Depends(get_db)):
    """Get user roles (admin endpoint)"""
    return crud.get_user_roles(db, user_id)


@app.post("/api/users/roles", response_model=UserRole, status_code=status.HTTP_201_CREATED)
def create_user_role(user_role: UserRoleCreate, db: Session = Depends(get_db)):
    """Create user role (admin endpoint)"""
    return crud.create_user_role(db, user_role)


# ==================== Appeal Attachments ====================

@app.get("/api/appeals/{appeal_id}/attachments", response_model=List[AppealAttachment])
def get_appeal_attachments(appeal_id: UUID, db: Session = Depends(get_db)):
    """Get all attachments for an appeal"""
    return crud.get_appeal_attachments(db, appeal_id)


@app.get("/api/attachments/{attachment_id}", response_model=AppealAttachment)
def get_appeal_attachment(attachment_id: UUID, db: Session = Depends(get_db)):
    """Get attachment by ID"""
    attachment = crud.get_appeal_attachment(db, attachment_id)
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")
    return attachment


@app.post("/api/attachments", response_model=AppealAttachment, status_code=status.HTTP_201_CREATED)
def create_appeal_attachment(
    attachment: AppealAttachmentCreate,
    db: Session = Depends(get_db)
):
    """Create an attachment for an appeal (admin endpoint)"""
    # Verify appeal exists
    appeal = crud.get_appeal(db, attachment.appeal_id)
    if not appeal:
        raise HTTPException(status_code=404, detail="Appeal not found")
    return crud.create_appeal_attachment(db, attachment)


@app.delete("/api/attachments/{attachment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appeal_attachment(attachment_id: UUID, db: Session = Depends(get_db)):
    """Delete an attachment (admin endpoint)"""
    success = crud.delete_appeal_attachment(db, attachment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Attachment not found")
    return None


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

