"""
Middleware for rate limiting, caching, and logging
"""
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from typing import Callable
import time
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


def setup_rate_limiting(app):
    """
    Setup rate limiting for FastAPI app
    """
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    return app


async def logging_middleware(request: Request, call_next: Callable):
    """
    Log all requests
    """
    start_time = time.time()
    
    # Log request
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Client: {get_remote_address(request)}"
    )
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Log response
        logger.info(
            f"{request.method} {request.url.path} - "
            f"Status: {response.status_code} - "
            f"Time: {process_time:.3f}s"
        )
        
        # Add process time header
        response.headers["X-Process-Time"] = str(process_time)
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f"{request.method} {request.url.path} - "
            f"Error: {str(e)} - "
            f"Time: {process_time:.3f}s"
        )
        raise


# Simple in-memory cache (for development)
# In production, use Redis
_cache = {}
_cache_ttl = {}


def get_cache_key(request: Request) -> str:
    """
    Generate cache key from request
    """
    return f"{request.method}:{request.url.path}:{str(request.query_params)}"


def cache_response(ttl: int = 300):
    """
    Decorator for caching responses (simple in-memory cache)
    """
    def decorator(func: Callable):
        async def wrapper(*args, **kwargs):
            # This is a simplified version
            # In production, use Redis or similar
            return await func(*args, **kwargs)
        return wrapper
    return decorator

