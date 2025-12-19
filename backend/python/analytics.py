"""
Advanced analytics and statistics
"""
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract, case
from typing import Dict, List, Optional
from datetime import datetime, date, timedelta
from models import Appeal, Direction, Content

# Маппинг школ ДВФУ
SCHOOLS_MAPPING = {
    'ИМО': 'Институт Мирового Океана',
    'ПИ': 'Политехнический Институт',
    'ПИШ': 'Передовая Инженерная Школа «Институт Биотехнологий, Биоинженерии и Пищевых Систем»',
    'ЮШ': 'Юридическая Школа',
    'Шминж': 'Школа Медицины и Наук о Жизни',
    'ИФКИС': 'Институт Физической Культуры и Спорта',
    'ИМКТ': 'Институт Математики и Компьютерных Технологий',
    'ИНТПМ': 'Институт Наукоемких Технологий и Передовых Материалов',
    'ВИ': 'Восточный Институт',
    'ШИГН': 'Школа Искусств и Гуманитарных Наук',
    'ШП': 'Школа Педагогики',
    'ШэМ': 'Школа Экономики и Менеджмента',
}

SCHOOL_CODES = list(SCHOOLS_MAPPING.keys())


def get_detailed_appeal_stats(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    direction_id: Optional[str] = None
) -> Dict:
    """
    Get detailed appeal statistics with time-based analysis
    """
    query = db.query(Appeal)
    
    if start_date:
        query = query.filter(Appeal.created_at >= start_date)
    if end_date:
        query = query.filter(Appeal.created_at <= end_date)
    if direction_id:
        query = query.filter(Appeal.direction_id == direction_id)
    
    total = query.count()
    
    # By status
    by_status = {}
    for status in ["new", "in_progress", "waiting", "closed"]:
        count = query.filter(Appeal.status == status).count()
        by_status[status] = count
    
    # By priority
    by_priority = {}
    for priority in ["low", "normal", "high", "urgent"]:
        count = query.filter(Appeal.priority == priority).count()
        by_priority[priority] = count
    
    # Average response time (for closed appeals)
    closed_appeals = query.filter(
        and_(
            Appeal.status == "closed",
            Appeal.first_response_at.isnot(None)
        )
    ).all()
    
    avg_response_time = None
    if closed_appeals:
        total_time = sum(
            (appeal.first_response_at - appeal.created_at).total_seconds()
            for appeal in closed_appeals
            if appeal.first_response_at
        )
        avg_response_time = total_time / len(closed_appeals) / 3600  # in hours
    
    # Average resolution time
    avg_resolution_time = None
    if closed_appeals:
        total_time = sum(
            (appeal.closed_at - appeal.created_at).total_seconds()
            for appeal in closed_appeals
            if appeal.closed_at
        )
        avg_resolution_time = total_time / len(closed_appeals) / 3600  # in hours
    
    # By direction
    by_direction = {}
    results = db.query(
        Direction.id,
        Direction.title,
        func.count(Appeal.id).label("count")
    ).join(Appeal, Direction.id == Appeal.direction_id, isouter=True)
    
    if start_date:
        results = results.filter(Appeal.created_at >= start_date)
    if end_date:
        results = results.filter(Appeal.created_at <= end_date)
    
    results = results.group_by(Direction.id, Direction.title).all()
    
    for direction_id, direction_title, count in results:
        by_direction[str(direction_id)] = {
            "title": direction_title,
            "count": count
        }
    
    # Daily trends (last 30 days)
    daily_trends = []
    for i in range(30):
        day = date.today() - timedelta(days=i)
        day_start = datetime.combine(day, datetime.min.time())
        day_end = datetime.combine(day, datetime.max.time())
        
        created = query.filter(
            and_(
                Appeal.created_at >= day_start,
                Appeal.created_at <= day_end
            )
        ).count()
        
        closed = query.filter(
            and_(
                Appeal.status == "closed",
                Appeal.closed_at >= day_start,
                Appeal.closed_at <= day_end
            )
        ).count()
        
        daily_trends.append({
            "date": day.isoformat(),
            "created": created,
            "closed": closed
        })
    
    daily_trends.reverse()  # Oldest first
    
    return {
        "total": total,
        "by_status": by_status,
        "by_priority": by_priority,
        "by_direction": by_direction,
        "avg_response_time_hours": avg_response_time,
        "avg_resolution_time_hours": avg_resolution_time,
        "daily_trends": daily_trends,
        "period": {
            "start": start_date.isoformat() if start_date else None,
            "end": end_date.isoformat() if end_date else None,
        }
    }


def get_user_performance_stats(
    db: Session,
    user_id: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> Dict:
    """
    Get performance statistics for a specific user
    """
    query = db.query(Appeal).filter(Appeal.assigned_to == user_id)
    
    if start_date:
        query = query.filter(Appeal.created_at >= start_date)
    if end_date:
        query = query.filter(Appeal.created_at <= end_date)
    
    total_assigned = query.count()
    closed = query.filter(Appeal.status == "closed").count()
    in_progress = query.filter(Appeal.status == "in_progress").count()
    waiting = query.filter(Appeal.status == "waiting").count()
    
    # Average resolution time for this user
    closed_by_user = query.filter(Appeal.status == "closed").all()
    avg_resolution_time = None
    if closed_by_user:
        total_time = sum(
            (appeal.closed_at - appeal.created_at).total_seconds()
            for appeal in closed_by_user
            if appeal.closed_at
        )
        avg_resolution_time = total_time / len(closed_by_user) / 3600  # in hours
    
    return {
        "user_id": user_id,
        "total_assigned": total_assigned,
        "closed": closed,
        "in_progress": in_progress,
        "waiting": waiting,
        "avg_resolution_time_hours": avg_resolution_time,
        "completion_rate": (closed / total_assigned * 100) if total_assigned > 0 else 0
    }


def get_content_analytics(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> Dict:
    """
    Get content analytics
    """
    query = db.query(Content)
    
    if start_date:
        query = query.filter(Content.published_at >= start_date)
    if end_date:
        query = query.filter(Content.published_at <= end_date)
    
    total = query.count()
    
    by_type = {}
    for content_type in ["news", "guide", "faq"]:
        count = query.filter(Content.type == content_type).count()
        by_type[content_type] = count
    
    by_status = {}
    for status in ["draft", "published", "archived"]:
        count = query.filter(Content.status == status).count()
        by_status[status] = count
    
    return {
        "total": total,
        "by_type": by_type,
        "by_status": by_status
    }

