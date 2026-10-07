from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    Lesson,
    LessonAttempt,
    User,
    UserSkillProgress,
)
from ..schemas import CompleteLessonRequest
from ..services.hearts import refresh_hearts
from ..services.gamification import (
    add_daily_xp,
    update_streak,
    refresh_daily_xp,
)

router = APIRouter(
    prefix="/api/lessons",
    tags=["lessons"],
)


@router.get("/{lesson_id}")
def get_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    lesson = (
        db.query(Lesson)
        .filter(Lesson.id == lesson_id)
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    exercises = []

    for exercise in sorted(
        lesson.exercises,
        key=lambda x: x.order_index,
    ):
        import json

        data = {}

        if exercise.data:
            try:
                data = json.loads(exercise.data)
            except json.JSONDecodeError:
                data = {}

        exercises.append({
            "id": exercise.id,
            "type": exercise.type,
            "question": exercise.question,
            "data": data,
            "order_index": exercise.order_index,
        })

    return {
        "id": lesson.id,
        "title": lesson.title,
        "skill": {
            "id": lesson.skill.id,
            "title": lesson.skill.title,
        },
        "total_exercises": len(exercises),
        "exercises": exercises,
    }


@router.post("/{lesson_id}/complete")
def complete_lesson(
    lesson_id: int,
    request: CompleteLessonRequest,
    db: Session = Depends(get_db),
):
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

    lesson = (
        db.query(Lesson)
        .filter(Lesson.id == lesson_id)
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    refresh_hearts(user)
    refresh_daily_xp(user)

    # Check whether this exact lesson was already completed.
    existing_attempt = (
        db.query(LessonAttempt)
        .filter(
            LessonAttempt.user_id == user.id,
            LessonAttempt.lesson_id == lesson.id,
        )
        .first()
    )

    completion_xp = 0

    if existing_attempt:
        # Don't farm completion XP repeatedly.
        db.commit()

        skill_progress = (
            db.query(UserSkillProgress)
            .filter(
                UserSkillProgress.user_id == user.id,
                UserSkillProgress.skill_id == lesson.skill_id,
            )
            .first()
        )

        return {
            "message": "Lesson already completed",
            "xp_earned": 0,
            "total_xp": user.xp,
            "daily_xp": user.daily_xp,
            "daily_goal": user.daily_goal,
            "hearts": user.hearts,
            "streak": user.streak,
            "skill_progress": (
                skill_progress.progress
                if skill_progress
                else 0
            ),
            "crowns": (
                skill_progress.crowns
                if skill_progress
                else 0
            ),
            "already_completed": True,
        }

    # -----------------------------------------
    # Update skill progress
    # -----------------------------------------

    skill = lesson.skill

    total_lessons = max(len(skill.lessons), 1)

    progress_per_lesson = int(
        100 / total_lessons
    )

    skill_progress = (
        db.query(UserSkillProgress)
        .filter(
            UserSkillProgress.user_id == user.id,
            UserSkillProgress.skill_id == skill.id,
        )
        .first()
    )

    if not skill_progress:
        skill_progress = UserSkillProgress(
            user_id=user.id,
            skill_id=skill.id,
            progress=0,
            completed=False,
            crowns=0,
        )

        db.add(skill_progress)

    skill_progress.progress = min(
        100,
        skill_progress.progress + progress_per_lesson,
    )

    if skill_progress.progress >= 100:
        skill_progress.progress = 100
        skill_progress.completed = True
        skill_progress.crowns = max(
            skill_progress.crowns,
            1,
        )

    # -----------------------------------------
    # Completion XP
    # -----------------------------------------

    completion_xp = 10

    add_daily_xp(
        user,
        completion_xp,
    )

    # -----------------------------------------
    # Streak
    # -----------------------------------------

    update_streak(user)

    # -----------------------------------------
    # Lesson attempt
    # -----------------------------------------

    attempt = LessonAttempt(
        user_id=user.id,
        lesson_id=lesson.id,
        score=100,
        xp_earned=completion_xp,
        completed_at=datetime.now(
            timezone.utc
        ).isoformat(),
    )

    db.add(attempt)

    db.commit()
    db.refresh(user)

    return {
        "message": "Lesson completed",
        "xp_earned": completion_xp,
        "total_xp": user.xp,
        "daily_xp": user.daily_xp,
        "daily_goal": user.daily_goal,
        "hearts": user.hearts,
        "streak": user.streak,
        "skill_progress": skill_progress.progress,
        "crowns": skill_progress.crowns,
        "already_completed": False,
    }