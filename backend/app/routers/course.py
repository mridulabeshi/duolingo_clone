from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    Course,
    User,
    Skill,
    UserSkillProgress,
)

router = APIRouter(
    prefix="/api/course",
    tags=["course"],
)


@router.get("")
def get_course(
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

    course = db.query(Course).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found",
        )

    units = []

    for unit in sorted(
        course.units,
        key=lambda x: x.order_index,
    ):
        skills = []

        sorted_skills = sorted(
            unit.skills,
            key=lambda x: x.order_index,
        )

        for index, skill in enumerate(sorted_skills):

            progress = (
                db.query(UserSkillProgress)
                .filter(
                    UserSkillProgress.user_id == user_id,
                    UserSkillProgress.skill_id == skill.id,
                )
                .first()
            )

            skill_progress = (
                progress.progress
                if progress
                else 0
            )

            completed = (
                progress.completed
                if progress
                else False
            )

            crowns = (
                progress.crowns
                if progress
                else 0
            )

            # First skill in the entire course is unlocked.
            # A later skill unlocks when the previous skill
            # in the same unit is completed.
            if unit.order_index == 1 and index == 0:
                locked = False

            elif index > 0:
                previous_skill = sorted_skills[index - 1]

                previous_progress = (
                    db.query(UserSkillProgress)
                    .filter(
                        UserSkillProgress.user_id == user_id,
                        UserSkillProgress.skill_id
                        == previous_skill.id,
                    )
                    .first()
                )

                locked = not (
                    previous_progress
                    and previous_progress.completed
                )

            else:
                # First skill of later units:
                # unlock it when the previous unit's final
                # skill is completed.
                previous_unit = (
                    db.query(type(unit))
                    .filter(
                        type(unit).course_id == course.id,
                        type(unit).order_index
                        < unit.order_index,
                    )
                    .order_by(
                        type(unit).order_index.desc()
                    )
                    .first()
                )

                if not previous_unit:
                    locked = True
                else:
                    previous_final_skill = (
                        db.query(Skill)
                        .filter(
                            Skill.unit_id
                            == previous_unit.id
                        )
                        .order_by(
                            Skill.order_index.desc()
                        )
                        .first()
                    )

                    previous_final_progress = (
                        db.query(UserSkillProgress)
                        .filter(
                            UserSkillProgress.user_id
                            == user_id,
                            UserSkillProgress.skill_id
                            == previous_final_skill.id,
                        )
                        .first()
                        if previous_final_skill
                        else None
                    )

                    locked = not (
                        previous_final_progress
                        and previous_final_progress.completed
                    )

            skills.append({
                "id": skill.id,
                "title": skill.title,
                "description": skill.description,
                "order_index": skill.order_index,
                "progress": skill_progress,
                "completed": completed,
                "crowns": crowns,
                "locked": locked,
                "lessons": [
                    {
                        "id": lesson.id,
                        "title": lesson.title,
                        "order_index": lesson.order_index,
                    }
                    for lesson in sorted(
                        skill.lessons,
                        key=lambda x: x.order_index,
                    )
                ],
            })

        units.append({
            "id": unit.id,
            "title": unit.title,
            "description": unit.description,
            "order_index": unit.order_index,
            "skills": skills,
        })

    return {
        "id": course.id,
        "name": course.name,
        "source_language": course.source_language,
        "target_language": course.target_language,
        "units": units,
    }