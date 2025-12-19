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


class UnauthorizedError(Exception):
    """Unauthorized access"""
    pass


class ForbiddenError(Exception):
    """Forbidden access"""
    pass


async def appeal_not_found_handler(request: Request, exc: AppealNotFoundError):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": "Appeal not found"}
    )


async def attachment_not_found_handler(request: Request, exc: AttachmentNotFoundError):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": "Attachment not found"}
    )


async def unauthorized_handler(request: Request, exc: UnauthorizedError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": "Unauthorized"}
    )


async def forbidden_handler(request: Request, exc: ForbiddenError):
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content={"detail": "Forbidden"}
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom validation error handler"""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": exc.errors(),
            "body": exc.body
        }
    )
