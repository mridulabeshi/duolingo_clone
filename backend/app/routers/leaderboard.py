from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User

router = APIRouter(
    prefix="/api/leaderboard",
    tags=["leaderboard"],
)


@router.get("")
def get_leaderboard(
    db: Session = Depends(get_db),
):
    users = (
        db.query(User)
        .order_by(User.xp.desc())
        .limit(50)
        .all()
    )

    return [
        {
            "rank": index + 1,
            "id": user.id,
            "username": user.username,
            "xp": user.xp,
            "streak": user.streak,
        }
        for index, user in enumerate(users)
    ]