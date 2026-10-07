from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..services.hearts import refresh_hearts
from ..services.gamification import refresh_daily_xp

router = APIRouter(
    prefix="/api/user",
    tags=["user"],
)


@router.get("/stats")
def get_user_stats(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    refresh_hearts(user)
    refresh_daily_xp(user)

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "username": user.username,
        "xp": user.xp,
        "streak": user.streak,
        "hearts": user.hearts,
        "gems": user.gems,
        "daily_goal": user.daily_goal,
        "daily_xp": user.daily_xp,
    }