import subprocess
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, SessionLocal
from .models import Course
from .routers import (
    course,
    lessons,
    answers,
    stats,
    auth,
    leaderboard,
)

# Create database tables
Base.metadata.create_all(bind=engine)


# Seed the database only when no course exists.
# This prevents the seed script from running on every restart.
def initialize_database():
    db: Session = SessionLocal()

    try:
        course_exists = db.query(Course).first() is not None
    finally:
        db.close()

    if not course_exists:
        print("No course found. Seeding database...")
        subprocess.run(
            [sys.executable, "-m", "app.seed"],
            check=True,
        )
        print("Database seeded successfully.")


initialize_database()


app = FastAPI(
    title="DuoLearn API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://duolingo-clone-mrid1.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(course.router)
app.include_router(lessons.router)
app.include_router(answers.router)
app.include_router(stats.router)
app.include_router(auth.router)
app.include_router(leaderboard.router)


@app.get("/")
def root():
    return {
        "message": "DuoLearn API is running"
    }