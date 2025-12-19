"""
Advanced analytics and statistics
"""
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract, case
from typing import Dict, List, Optional
from datetime import datetime, date, timedelta
from models import Appeal, Direction, Content


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
    
