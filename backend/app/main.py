from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import (
    course,
    lessons,
    answers,
    stats,
    auth,
    leaderboard,
)

Base.metadata.create_all(bind=engine)

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