"""
FastAPI application for OSS DVFU backend
"""
from fastapi import FastAPI, Depends, HTTPException, status, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from datetime import date, datetime
import crud
import search
import export
import analytics
from middleware import setup_rate_limiting, logging_middleware, limiter
from metrics import get_metrics
from cache import (
    get_cache, set_cache, cache_directions_key, cache_direction_key,
    cache_content_key, cache_stats_key,
    invalidate_directions_cache, invalidate_direction_cache,
    invalidate_content_cache, invalidate_stats_cache
)
from auth import require_any_role

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

# Create tables (in production, use migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OSS DVFU API",
    description="Backend API for OSS DVFU website",
    version="2.0.0",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    openapi_url="/api/v1/openapi.json"
)

# Setup rate limiting
app = setup_rate_limiting(app)

# Add logging middleware
app.middleware("http")(logging_middleware)

# Register error handlers
app.add_exception_handler(AppealNotFoundError, appeal_not_found_handler)
app.add_exception_handler(AttachmentNotFoundError, attachment_not_found_handler)

# CORS middleware
import os
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
ARCHIVE_APPEALS = os.getenv("ARCHIVE_APPEALS", "true").lower() == "true"
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _appeals_archive_disabled_response(action: str = "Operation"):
    """Стандартный ответ для отключенных операций с обращениями."""
    raise HTTPException(
        status_code=status.HTTP_410_GONE,
        detail=f"{action} is disabled: appeals are in archive mode",
    )


# ==================== Health Checks ====================

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Простая проверка работоспособности API
    """
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0",
        "service": "OSS DVFU API"
    }


@app.get("/health/detailed", tags=["Health"])
async def detailed_health_check(db: Session = Depends(get_db)):
    """
    Детальная проверка всех компонентов системы
    Проверяет: база данных, Redis, Supabase
    """
    checks = {
        "database": False,
        "redis": False,
        "supabase": False
    }
    
    errors = []
    
    # Проверка БД
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        checks["database"] = True
    except Exception as e:
        errors.append(f"Database: {str(e)}")
    
    # Проверка Redis (если настроен)
    try:
        redis_url = os.getenv("REDIS_URL")
        if redis_url:
            import redis
            r = redis.from_url(redis_url, socket_connect_timeout=1)
            r.ping()
            checks["redis"] = True
        else:
            checks["redis"] = None  # Не настроен
    except Exception as e:
        errors.append(f"Redis: {str(e)}")
    
    # Проверка Supabase (если настроен)
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        if supabase_url:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{supabase_url}/rest/v1/",
                    timeout=2.0
                )
                if response.status_code < 500:
                    checks["supabase"] = True
                else:
                    errors.append(f"Supabase: HTTP {response.status_code}")
        else:
            checks["supabase"] = None  # Не настроен
    except Exception as e:
        errors.append(f"Supabase: {str(e)}")
    
    # Определить общий статус
    active_checks = [v for v in checks.values() if v is True]
    if len(active_checks) == len([v for v in checks.values() if v is not None]):
        status = "ok"
    elif len(active_checks) > 0:
        status = "degraded"
    else:
        status = "error"
    
    return {
        "status": status,
        "checks": checks,
        "errors": errors if errors else None,
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0"
    }


@app.get("/metrics", tags=["Health"])
async def metrics_endpoint():
    """
    Метрики API (последние 5 минут)
    """
    return get_metrics()


# ==================== Directions ====================

@app.get("/api/directions", response_model=List[Direction])
def get_directions(
    active_only: bool = Query(True),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get all directions (cached for 1 hour)"""
    # For caching, we only cache the common case (skip=0, limit=100, active_only=True)
    # Other cases bypass cache
    if skip == 0 and limit == 100:
        cache_key_str = cache_directions_key(active_only=active_only)
        cached = get_cache(cache_key_str)
        if cached is not None:
            return cached
    
    # Get from database
    directions = crud.get_directions(db, skip=skip, limit=limit, active_only=active_only)
    
    # Cache only common case
    if skip == 0 and limit == 100:
        cache_key_str = cache_directions_key(active_only=active_only)
        # Convert to dict for caching
        directions_dict = [{"id": str(d.id), "slug": d.slug, "title": d.title, 
                           "description": d.description, "color_key": d.color_key,
                           "is_active": d.is_active, "created_at": d.created_at.isoformat() 
                           if d.created_at else None} for d in directions]
        set_cache(cache_key_str, directions_dict, ttl=3600)  # 1 hour
    
    return directions


@app.get("/api/directions/{direction_id}", response_model=Direction)
def get_direction(direction_id: UUID, db: Session = Depends(get_db)):
    """Get direction by ID (cached for 1 hour)"""
    cache_key_str = cache_direction_key(direction_id=str(direction_id))
    cached = get_cache(cache_key_str)
    if cached is not None:
        # Reconstruct Direction object from dict
        from models import Direction
        return Direction(**cached)
    
    direction = crud.get_direction(db, direction_id)
    if not direction:
        raise HTTPException(status_code=404, detail="Direction not found")
    
    # Cache the result
    direction_dict = {
        "id": str(direction.id),
        "slug": direction.slug,
        "title": direction.title,
        "description": direction.description,
        "color_key": direction.color_key,
        "is_active": direction.is_active,
        "created_at": direction.created_at.isoformat() if direction.created_at else None
    }
    set_cache(cache_key_str, direction_dict, ttl=3600)  # 1 hour
    
    return direction


@app.get("/api/directions/slug/{slug}", response_model=Direction)
def get_direction_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get direction by slug (cached for 1 hour)"""
    cache_key_str = cache_direction_key(slug=slug)
    cached = get_cache(cache_key_str)
    if cached is not None:
        # Reconstruct Direction object from dict
        from models import Direction
        return Direction(**cached)
    
    direction = crud.get_direction_by_slug(db, slug)
    if not direction:
        raise HTTPException(status_code=404, detail="Direction not found")
    
    # Cache the result
    direction_dict = {
        "id": str(direction.id),
        "slug": direction.slug,
        "title": direction.title,
        "description": direction.description,
        "color_key": direction.color_key,
        "is_active": direction.is_active,
        "created_at": direction.created_at.isoformat() if direction.created_at else None
    }
    set_cache(cache_key_str, direction_dict, ttl=3600)  # 1 hour
    
    return direction


# ==================== Appeals ====================

@app.post("/api/appeals", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def create_appeal(appeal: AppealCreate, db: Session = Depends(get_db)):
    """Create a new appeal (public endpoint)"""
    if ARCHIVE_APPEALS:
        _appeals_archive_disabled_response("Appeal creation")
    db_appeal = crud.create_appeal(db, appeal)
    return TokenResponse(public_token=db_appeal.public_token)


@app.get("/api/appeals/token/{token}", response_model=AppealPublic)
def get_appeal_by_token(token: UUID, db: Session = Depends(get_db)):
    """Get appeal by public token (public endpoint)"""
    if ARCHIVE_APPEALS:
        _appeals_archive_disabled_response("Public appeal lookup")
    appeal = crud.get_appeal_by_token(db, token)
    if not appeal:
        raise HTTPException(status_code=404, detail="Appeal not found")
    return appeal


@app.get("/api/appeals", response_model=List[Appeal])
@limiter.limit("100/minute")
def get_appeals(
    request: Request,
    direction_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None, pattern="^(new|in_progress|waiting|closed)$"),
    priority: Optional[str] = Query(None, pattern="^(low|normal|high|urgent)$"),
    assigned_to: Optional[UUID] = Query(None),
    overdue_only: bool = Query(False),
    sort_by: Optional[str] = Query("created_at", pattern="^(created_at|status|priority|deadline)$"),
    sort_order: Optional[str] = Query("desc", pattern="^(asc|desc)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_any_role(("lead", "board", "staff")))
):
    """Get appeals with improved sorting (admin endpoint - requires auth in production)"""
    if overdue_only:
        return crud.get_overdue_appeals(db, skip=skip, limit=limit)
    return crud.get_appeals(
        db, 
        skip=skip, 
        limit=limit, 
        direction_id=direction_id, 
        status=status,
        priority=priority,
        assigned_to=assigned_to,
        sort_by=sort_by,
        sort_order=sort_order
    )


@app.get("/api/appeals/{appeal_id}", response_model=Appeal)
def get_appeal(
    appeal_id: UUID,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Get appeal by ID (admin endpoint)"""
    appeal = crud.get_appeal(db, appeal_id)
    if not appeal:
        raise HTTPException(status_code=404, detail="Appeal not found")
    return appeal


@app.patch("/api/appeals/{appeal_id}", response_model=Appeal)
def update_appeal(
    appeal_id: UUID,
    appeal_update: AppealUpdate,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Update appeal (admin endpoint)"""
    if ARCHIVE_APPEALS:
        _appeals_archive_disabled_response("Appeal update")
    appeal = crud.update_appeal(db, appeal_id, appeal_update)
    if not appeal:
        raise HTTPException(status_code=404, detail="Appeal not found")
    return appeal


@app.get("/api/appeals/stats/summary", response_model=AppealStats)
@limiter.limit("30/minute")
def get_appeal_stats(
    request: Request,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Get appeal statistics (admin endpoint)"""
    stats = crud.get_appeal_stats(db)
    return AppealStats(**stats)


@app.get("/api/appeals/stats/detailed")
@limiter.limit("20/minute")
def get_detailed_stats(
    request: Request,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    direction_id: Optional[UUID] = Query(None),
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Get detailed appeal statistics with analytics"""
    stats = analytics.get_detailed_appeal_stats(
        db,
        start_date=start_date,
        end_date=end_date,
        direction_id=str(direction_id) if direction_id else None
    )
    return stats


@app.get("/api/users/{user_id}/performance")
@limiter.limit("30/minute")
def get_user_performance(
    request: Request,
    user_id: UUID,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Get performance statistics for a user"""
    stats = analytics.get_user_performance_stats(
        db,
        str(user_id),
        start_date=start_date,
        end_date=end_date
    )
    return stats


# ==================== Appeal Comments ====================

@app.get("/api/appeals/{appeal_id}/comments", response_model=List[AppealComment])
def get_appeal_comments(
    appeal_id: UUID,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Get comments for an appeal (admin endpoint)"""
    return crud.get_appeal_comments(db, appeal_id)


@app.post("/api/appeals/{appeal_id}/comments", response_model=AppealComment, status_code=status.HTTP_201_CREATED)
def create_appeal_comment(
    appeal_id: UUID,
    comment: AppealCommentCreate,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Create a comment on an appeal (admin endpoint)"""
    if ARCHIVE_APPEALS:
        _appeals_archive_disabled_response("Appeal comments write")
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
    """Get content by slug (cached for 30 minutes)"""
    cache_key_str = cache_content_key(slug=slug)
    cached = get_cache(cache_key_str)
    if cached is not None:
        from models import Content
        return Content(**cached)
    
    content = crud.get_content_by_slug(db, slug)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    # Cache only published content
    if content.status == "published":
        content_dict = {
            "id": str(content.id),
            "type": content.type,
            "title": content.title,
            "slug": content.slug,
            "body": content.body,
            "direction_id": str(content.direction_id) if content.direction_id else None,
            "status": content.status,
            "published_at": content.published_at.isoformat() if content.published_at else None,
            "updated_at": content.updated_at.isoformat() if content.updated_at else None
        }
        set_cache(cache_key_str, content_dict, ttl=1800)  # 30 minutes
    
    return content


@app.post("/api/content", response_model=Content, status_code=status.HTTP_201_CREATED)
def create_content(
    content: ContentCreate,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Create content (admin endpoint)"""
    new_content = crud.create_content(db, content)
    # Invalidate content cache
    invalidate_content_cache()
    return new_content


@app.patch("/api/content/{content_id}", response_model=Content)
def update_content(
    content_id: UUID,
    content_update: ContentUpdate,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Update content (admin endpoint)"""
    content = crud.update_content(db, content_id, content_update)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    # Invalidate cache for this content
    invalidate_content_cache(content_id=str(content_id), slug=content.slug)
    return content


@app.delete("/api/content/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_content_endpoint(
    content_id: UUID,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("board", "staff"))),
):
    """Delete content (admin endpoint)"""
    success = crud.delete_content(db, content_id)
    if not success:
        raise HTTPException(status_code=404, detail="Content not found")
    # Invalidate cache
    invalidate_content_cache(content_id=str(content_id))
    return None


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
def create_document(
    document: DocumentCreate,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Create document (admin endpoint)"""
    return crud.create_document(db, document)


# ==================== User Roles ====================

@app.get("/api/users/{user_id}/roles", response_model=List[UserRole])
def get_user_roles(
    user_id: UUID,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("board", "staff"))),
):
    """Get user roles (admin endpoint)"""
    return crud.get_user_roles(db, user_id)


@app.post("/api/users/roles", response_model=UserRole, status_code=status.HTTP_201_CREATED)
def create_user_role(
    user_role: UserRoleCreate,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("board", "staff"))),
):
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
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Create an attachment for an appeal (admin endpoint)"""
    if ARCHIVE_APPEALS:
        _appeals_archive_disabled_response("Attachment upload")
    # Verify appeal exists
    appeal = crud.get_appeal(db, attachment.appeal_id)
    if not appeal:
        raise HTTPException(status_code=404, detail="Appeal not found")
    return crud.create_appeal_attachment(db, attachment)


@app.delete("/api/attachments/{attachment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appeal_attachment(
    attachment_id: UUID,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Delete an attachment (admin endpoint)"""
    if ARCHIVE_APPEALS:
        _appeals_archive_disabled_response("Attachment delete")
    success = crud.delete_appeal_attachment(db, attachment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Attachment not found")
    return None


# ==================== Search ====================

@app.get("/api/search/appeals", response_model=List[Appeal])
@limiter.limit("60/minute")
def search_appeals_endpoint(
    request: Request,
    q: str = Query(..., min_length=2, description="Search query"),
    direction_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None, pattern="^(new|in_progress|waiting|closed)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Full-text search in appeals"""
    results = search.search_appeals(
        db,
        query=q,
        direction_id=direction_id,
        status=status,
        skip=skip,
        limit=limit
    )
    return results


@app.get("/api/search/content", response_model=List[Content])
@limiter.limit("60/minute")
def search_content_endpoint(
    request: Request,
    q: str = Query(..., min_length=2, description="Search query"),
    type: Optional[str] = Query(None, pattern="^(news|guide|faq)$"),
    direction_id: Optional[UUID] = Query(None),
    published_only: bool = Query(True),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Full-text search in content"""
    results = search.search_content(
        db,
        query=q,
        content_type=type,
        direction_id=direction_id,
        published_only=published_only,
        skip=skip,
        limit=limit
    )
    return results


@app.get("/api/search/appeals/tags", response_model=List[Appeal])
@limiter.limit("60/minute")
def search_appeals_by_tags_endpoint(
    request: Request,
    tags: List[str] = Query(..., description="List of tags to search"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_any_role(("lead", "board", "staff"))),
):
    """Search appeals by tags"""
    results = search.search_appeals_by_tags(
        db,
        tags=tags,
        skip=skip,
        limit=limit
    )
    return results


# ==================== Export ====================

@app.get("/api/export/appeals/csv")
@limiter.limit("10/minute")
def export_appeals_csv(
    request: Request,
    direction_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None),
    include_internal: bool = Query(False),
    db: Session = Depends(get_db)
):
    """Export appeals to CSV"""
    if ARCHIVE_APPEALS:
        _appeals_archive_disabled_response("Appeals export")
    appeals = crud.get_appeals(
        db,
        direction_id=direction_id,
        status=status,
        skip=0,
        limit=10000  # Max export limit
    )
    
    csv_data = export.export_appeals_to_csv(db, appeals, include_internal=include_internal)
    
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=appeals_{date.today().isoformat()}.csv"
        }
    )


@app.get("/api/export/appeals/excel")
@limiter.limit("10/minute")
def export_appeals_excel(
    request: Request,
    direction_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None),
    include_internal: bool = Query(False),
    db: Session = Depends(get_db)
):
    """Export appeals to Excel"""
    if ARCHIVE_APPEALS:
        _appeals_archive_disabled_response("Appeals export")
    appeals = crud.get_appeals(
        db,
        direction_id=direction_id,
        status=status,
        skip=0,
        limit=10000  # Max export limit
    )
    
    excel_data = export.export_appeals_to_excel(db, appeals, include_internal=include_internal)
    
    return Response(
        content=excel_data,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f"attachment; filename=appeals_{date.today().isoformat()}.xlsx"
        }
    )


@app.get("/api/export/stats/csv")
@limiter.limit("10/minute")
def export_stats_csv(
    request: Request,
    db: Session = Depends(get_db)
):
    """Export statistics to CSV"""
    stats = crud.get_appeal_stats(db)
    csv_data = export.export_statistics_to_csv(stats)
    
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=stats_{date.today().isoformat()}.csv"
        }
    )


# ==================== Content Analytics ====================

@app.get("/api/analytics/content")
@limiter.limit("20/minute")
def get_content_analytics(
    request: Request,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    """Get content analytics"""
    analytics_data = analytics.get_content_analytics(
        db,
        start_date=start_date,
        end_date=end_date
    )
    return analytics_data


@app.get("/api/analytics/schools")
@limiter.limit("20/minute")
def get_schools_analytics(
    request: Request,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    school_code: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get appeals statistics grouped by schools/institutes"""
    stats = analytics.get_appeals_by_school(
        db,
        start_date=start_date,
        end_date=end_date,
        school_code=school_code
    )
    return stats


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

