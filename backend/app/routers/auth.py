from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)


def user_response(user):
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


@router.post("/register")
def register(
    username: str,
    db: Session = Depends(get_db),
):
    username = username.strip()

    if len(username) < 3:
        raise HTTPException(
            status_code=400,
            detail="Username must contain at least 3 characters",
        )

    if len(username) > 30:
        raise HTTPException(
            status_code=400,
            detail="Username must be at most 30 characters",
        )

    existing = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Username already exists",
        )

    user = User(
        username=username,
        email=f"{username}@duolingo.local",
        xp=0,
        streak=0,
        hearts=5,
        gems=0,
        daily_goal=20,
        daily_xp=0,
        daily_xp_date=None,
        last_activity=None,
        last_heart_loss=None,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user_response(user)


@router.post("/login")
def login(
    username: str,
    db: Session = Depends(get_db),
):
    username = username.strip()

    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Username not found",
        )

    return user_response(user)