"""
Data export functionality (CSV, Excel)
"""
import csv
import io
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from models import Appeal, Content, Direction


def export_appeals_to_csv(
    db: Session,
    appeals: List[Appeal],
    include_internal: bool = False
) -> str:
    """
    Export appeals to CSV format
    """
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Headers
    headers = [
        "ID", "Заголовок", "Описание", "Статус", "Приоритет",
        "Направление", "Дата создания", "Дата закрытия",
        "Тип контакта", "Институт", "Категория"
    ]
    
    if include_internal:
        headers.extend(["Назначено", "Дедлайн", "Теги"])
    
    writer.writerow(headers)
    
    # Data rows
    for appeal in appeals:
        direction_name = ""
        if appeal.direction:
            direction_name = appeal.direction.title
        
        row = [
            str(appeal.id),
            appeal.title,
            appeal.description[:200] + "..." if len(appeal.description) > 200 else appeal.description,
            appeal.status,
            appeal.priority or "normal",
            direction_name,
            appeal.created_at.strftime("%Y-%m-%d %H:%M:%S") if appeal.created_at else "",
            appeal.closed_at.strftime("%Y-%m-%d %H:%M:%S") if appeal.closed_at else "",
            appeal.contact_type or "",
            appeal.institute or "",
            appeal.category or "",
        ]
        
        if include_internal:
            row.extend([
                str(appeal.assigned_to) if appeal.assigned_to else "",
                appeal.deadline.strftime("%Y-%m-%d") if appeal.deadline else "",
                ", ".join(appeal.tags) if appeal.tags else "",
            ])
        
        writer.writerow(row)
    
    return output.getvalue()


def export_appeals_to_excel(
    db: Session,
    appeals: List[Appeal],
    include_internal: bool = False
) -> bytes:
    """
    Export appeals to Excel format (requires openpyxl)
    """
    try:
        from openpyxl import Workbook
        from openpyxl.styles import Font, PatternFill, Alignment
    except ImportError:
        raise ImportError("openpyxl is required for Excel export. Install with: pip install openpyxl")
    
    wb = Workbook()
    ws = wb.active
    ws.title = "Обращения"
    
    # Headers
    headers = [
        "ID", "Заголовок", "Описание", "Статус", "Приоритет",
        "Направление", "Дата создания", "Дата закрытия",
        "Тип контакта", "Институт", "Категория"
    ]
    
    if include_internal:
        headers.extend(["Назначено", "Дедлайн", "Теги"])
    
    # Style headers

