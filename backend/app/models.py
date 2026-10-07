from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=True)

    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    gems = Column(Integer, default=0)
    daily_goal = Column(Integer, default=20)

    # Daily XP tracking
    daily_xp = Column(Integer, default=0)
    daily_xp_date = Column(String, nullable=True)

    # Streak/activity tracking
    last_activity = Column(String, nullable=True)

    # Heart regeneration
    last_heart_loss = Column(String, nullable=True)

    skill_progress = relationship(
        "UserSkillProgress",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    lesson_attempts = relationship(
        "LessonAttempt",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    source_language = Column(String, nullable=False)
    target_language = Column(String, nullable=False)

    units = relationship(
        "Unit",
        back_populates="course",
        cascade="all, delete-orphan",
        order_by="Unit.order_index",
    )


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)

    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)

    course = relationship("Course", back_populates="units")

    skills = relationship(
        "Skill",
        back_populates="unit",
        cascade="all, delete-orphan",
        order_by="Skill.order_index",
    )


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)

    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)

    unit = relationship("Unit", back_populates="skills")

    lessons = relationship(
        "Lesson",
        back_populates="skill",
        cascade="all, delete-orphan",
        order_by="Lesson.order_index",
    )


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)

    title = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)

    skill = relationship("Skill", back_populates="lessons")

    exercises = relationship(
        "Exercise",
        back_populates="lesson",
        cascade="all, delete-orphan",
        order_by="Exercise.order_index",
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)

    type = Column(String, nullable=False)
    question = Column(Text, nullable=False)
    correct_answer = Column(Text, nullable=False)

    # JSON string containing options/pairs/etc.
    data = Column(Text, nullable=True)

    order_index = Column(Integer, nullable=False)

    lesson = relationship("Lesson", back_populates="exercises")


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)

    completed = Column(Boolean, default=False)
    progress = Column(Integer, default=0)
    crowns = Column(Integer, default=0)

    user = relationship("User", back_populates="skill_progress")


class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)

    score = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    completed_at = Column(String, nullable=True)

    user = relationship("User", back_populates="lesson_attempts")