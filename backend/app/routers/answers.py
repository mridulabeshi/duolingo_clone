from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from ..database import get_db
from ..models import Exercise, User
from ..schemas import AnswerRequest
from ..services.hearts import (
    refresh_hearts,
    start_heart_regeneration,
)
from ..services.gamification import (
    add_daily_xp,
)

router = APIRouter(
    prefix="/api/lessons",
    tags=["lessons"],
)


@router.post("/{lesson_id}/answer")
def submit_answer(
    lesson_id: int,
    request: AnswerRequest,
    db: Session = Depends(get_db),
):
    exercise = (
        db.query(Exercise)
        .filter(
            Exercise.id == request.exercise_id,
            Exercise.lesson_id == lesson_id,
        )
        .first()
    )

    if not exercise:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found",
        )

    user = (
        db.query(User)
        .filter(User.id == request.user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    refresh_hearts(user)

    # Cannot submit answers with zero hearts.
    if user.hearts <= 0:
        db.commit()

        return {
            "correct": False,
            "correct_answer": exercise.correct_answer,
            "xp_earned": 0,
            "total_xp": user.xp,
            "daily_xp": user.daily_xp,
            "daily_goal": user.daily_goal,
            "hearts": 0,
            "out_of_hearts": True,
        }

    submitted_answer = request.answer.strip()

    # Match-pairs validation
    if exercise.type == "match":
        try:
            exercise_data = json.loads(
                exercise.data or "{}"
            )

            pairs = exercise_data.get("pairs", [])

            expected = {
                f"{pair['left']}={pair['right']}"
                for pair in pairs
            }

            submitted = {
                pair.strip()
                for pair in submitted_answer.split("|")
                if pair.strip()
            }

            correct = (
                len(submitted) == len(expected)
                and submitted == expected
            )

        except (
            json.JSONDecodeError,
            KeyError,
            TypeError,
        ):
            correct = False

    else:
        correct = (
            submitted_answer.lower()
            == exercise.correct_answer.strip().lower()
        )

    xp_earned = 0

    if correct:
        xp_earned = 2
        add_daily_xp(user, xp_earned)

    else:
        user.hearts -= 1

        if user.hearts < 5:
            start_heart_regeneration(user)

    db.commit()
    db.refresh(user)

    return {
        "correct": correct,
        "correct_answer": exercise.correct_answer,
        "xp_earned": xp_earned,
        "total_xp": user.xp,
        "daily_xp": user.daily_xp,
        "daily_goal": user.daily_goal,
        "hearts": user.hearts,
        "out_of_hearts": user.hearts == 0,
    }