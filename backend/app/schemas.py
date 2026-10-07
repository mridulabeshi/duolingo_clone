from pydantic import BaseModel


class AnswerRequest(BaseModel):
    exercise_id: int
    answer: str
    user_id: int


class CompleteLessonRequest(BaseModel):
    user_id: int