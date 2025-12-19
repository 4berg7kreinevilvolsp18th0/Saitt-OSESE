from uuid import UUID
import os
import httpx

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

security = HTTPBearer()


async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Verify Supabase JWT token and return user info
    
    In production, this should verify the token with Supabase.
    For now, it's a placeholder that extracts user_id from token.
    """
    token = credentials.credentials
    
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase not configured"
        )
    
    # In production, verify token with Supabase
    # For now, we'll use a simple approach
    try:
        # Call Supabase to verify token
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": SUPABASE_ANON_KEY
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token"
                )
            
            user_data = response.json()
            return {
                "id": UUID(user_data.get("id")),
                "email": user_data.get("email"),
                "user_metadata": user_data.get("user_metadata", {})
            }
    except httpx.RequestError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Failed to verify token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )


async def get_current_user(user: dict = Depends(verify_token)) -> dict:
    """Get current authenticated user"""
    return user


async def get_current_user_id(user: dict = Depends(get_current_user)) -> UUID:
    """Get current user ID"""
    return user["id"]


# Role checking (requires database access)
def check_role(user_id: UUID, required_role: str, direction_id: Optional[UUID] = None, db=None) -> bool:
    """
    Check if user has required role
    
    This should be called from within a route that has db access.
    """
    if not db:
        return False
    
    try:
        from crud import get_user_roles
        roles = get_user_roles(db, user_id)
        
        # Check for board or staff (can do everything)
        for role in roles:
            if role.role in ["board", "staff"]:
                return True
            if role.role == required_role:
                if direction_id is None or role.direction_id == direction_id:
                    return True
                if required_role == "lead" and role.direction_id == direction_id:
                    return True
        
        return False
    except Exception:
        return False


def require_role(required_role: str, direction_id: Optional[UUID] = None):
    """
    Dependency factory for requiring specific role
    
    Usage:
        from database import get_db
        from sqlalchemy.orm import Session
        
        @app.get("/admin/endpoint")
        def admin_endpoint(
            user: dict = Depends(get_current_user),
            db: Session = Depends(get_db)
        ):
            if not check_role(user["id"], "board", None, db):
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            ...
    """
    from database import get_db
    from sqlalchemy.orm import Session
    
    def role_checker(
        user: dict = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        if not check_role(user["id"], required_role, direction_id, db):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires {required_role} role"
            )
        return user
    return role_checker

