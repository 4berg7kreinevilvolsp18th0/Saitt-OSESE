"""
Custom error handlers and exceptions
"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError


class AppealNotFoundError(Exception):
    """Appeal not found"""
    pass


class AttachmentNotFoundError(Exception):
    """Attachment not found"""
    pass

