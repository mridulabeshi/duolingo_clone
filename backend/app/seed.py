import json

from app.database import Base, engine, SessionLocal
from app.models import (
    User,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    UserSkillProgress,
)


Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()


# --------------------------------------------------
# USER
# --------------------------------------------------

user = User(
    username="learner",
    email="learner@duolingo.local",
    xp=120,
    streak=5,
    hearts=5,
    gems=250,
    daily_goal=20,
)

db.add(user)


# --------------------------------------------------
# COURSE
# English → German
# --------------------------------------------------

course = Course(
    name="German",
    source_language="English",
    target_language="German",
)

db.add(course)
db.flush()


# --------------------------------------------------
# UNIT 1 — BASICS
# --------------------------------------------------

unit1 = Unit(
    course_id=course.id,
    title="Basics",
    description="Learn basic German words and greetings.",
    order_index=1,
)

db.add(unit1)
db.flush()


# --------------------------------------------------
# SKILL 1 — GREETINGS
# --------------------------------------------------

skill1 = Skill(
    unit_id=unit1.id,
    title="Greetings",
    description="Learn common German greetings.",
    order_index=1,
)

db.add(skill1)
db.flush()


lesson1 = Lesson(
    skill_id=skill1.id,
    title="Basic Greetings",
    order_index=1,
)

db.add(lesson1)
db.flush()


exercises1 = [
    Exercise(
        lesson_id=lesson1.id,
        type="multiple_choice",
        question="How do you say 'Hello' in German?",
        correct_answer="Hallo",
        data=json.dumps({
            "options": [
                "Hallo",
                "Danke",
                "Tschüss",
                "Bitte",
            ]
        }),
        order_index=1,
    ),

    Exercise(
        lesson_id=lesson1.id,
        type="translate",
        question="Translate: Thank you",
        correct_answer="Danke",
        data=json.dumps({
            "word_bank": [
                "Danke",
                "Hallo",
                "Bitte",
                "Tschüss",
            ]
        }),
        order_index=2,
    ),

    Exercise(
        lesson_id=lesson1.id,
        type="match",
        question="Match the English words with German.",
        correct_answer="",
        data=json.dumps({
            "pairs": [
                {
                    "left": "Hello",
                    "right": "Hallo",
                },
                {
                    "left": "Thanks",
                    "right": "Danke",
                },
                {
                    "left": "Goodbye",
                    "right": "Tschüss",
                },
            ]
        }),
        order_index=3,
    ),

    Exercise(
        lesson_id=lesson1.id,
        type="fill_blank",
        question="Guten ___",
        correct_answer="Morgen",
        data=json.dumps({
            "options": [
                "Morgen",
                "Danke",
                "Hallo",
                "Abend",
            ]
        }),
        order_index=4,
    ),

    Exercise(
        lesson_id=lesson1.id,
        type="type_answer",
        question="Type the German word for 'Goodbye'.",
        correct_answer="Tschüss",
        data=json.dumps({}),
        order_index=5,
    ),
]

db.add_all(exercises1)


# --------------------------------------------------
# SKILL 2 — INTRODUCTIONS
# --------------------------------------------------

skill2 = Skill(
    unit_id=unit1.id,
    title="Introductions",
    description="Learn how to introduce yourself in German.",
    order_index=2,
)

db.add(skill2)
db.flush()


lesson2 = Lesson(
    skill_id=skill2.id,
    title="Introducing Yourself",
    order_index=1,
)

db.add(lesson2)
db.flush()


exercises2 = [
    Exercise(
        lesson_id=lesson2.id,
        type="multiple_choice",
        question="How do you say 'My name is...' in German?",
        correct_answer="Ich heiße...",
        data=json.dumps({
            "options": [
                "Ich heiße...",
                "Danke...",
                "Guten Abend...",
                "Tschüss...",
            ]
        }),
        order_index=1,
    ),

    Exercise(
        lesson_id=lesson2.id,
        type="translate",
        question="Translate: My name is Anna.",
        correct_answer="Ich heiße Anna.",
        data=json.dumps({
            "word_bank": [
                "Ich",
                "heiße",
                "Anna.",
                "Danke",
            ]
        }),
        order_index=2,
    ),

    Exercise(
        lesson_id=lesson2.id,
        type="match",
        question="Match the English words with German.",
        correct_answer="",
        data=json.dumps({
            "pairs": [
                {
                    "left": "My name",
                    "right": "Mein Name",
                },
                {
                    "left": "I am",
                    "right": "Ich bin",
                },
                {
                    "left": "Good",
                    "right": "Gut",
                },
            ]
        }),
        order_index=3,
    ),

    Exercise(
        lesson_id=lesson2.id,
        type="fill_blank",
        question="Ich ___ Anna.",
        correct_answer="bin",
        data=json.dumps({
            "options": [
                "bin",
                "heiße",
                "danke",
                "gut",
            ]
        }),
        order_index=4,
    ),

    Exercise(
        lesson_id=lesson2.id,
        type="type_answer",
        question="Type the German word for 'I'.",
        correct_answer="Ich",
        data=json.dumps({}),
        order_index=5,
    ),
]

db.add_all(exercises2)


# --------------------------------------------------
# UNIT 2 — EVERYDAY LIFE
# --------------------------------------------------

unit2 = Unit(
    course_id=course.id,
    title="Everyday Life",
    description="Learn useful German words for everyday situations.",
    order_index=2,
)

db.add(unit2)
db.flush()


# --------------------------------------------------
# SKILL 3 — FOOD
# --------------------------------------------------

skill3 = Skill(
    unit_id=unit2.id,
    title="Food",
    description="Learn common German food words.",
    order_index=1,
)

db.add(skill3)
db.flush()


lesson3 = Lesson(
    skill_id=skill3.id,
    title="Food Basics",
    order_index=1,
)

db.add(lesson3)
db.flush()


exercises3 = [
    Exercise(
        lesson_id=lesson3.id,
        type="multiple_choice",
        question="How do you say 'water' in German?",
        correct_answer="Wasser",
        data=json.dumps({
            "options": [
                "Wasser",
                "Brot",
                "Milch",
                "Käse",
            ]
        }),
        order_index=1,
    ),

    Exercise(
        lesson_id=lesson3.id,
        type="translate",
        question="Translate: bread",
        correct_answer="Brot",
        data=json.dumps({
            "word_bank": [
                "Brot",
                "Wasser",
                "Milch",
                "Käse",
            ]
        }),
        order_index=2,
    ),

    Exercise(
        lesson_id=lesson3.id,
        type="match",
        question="Match the food words.",
        correct_answer="",
        data=json.dumps({
            "pairs": [
                {
                    "left": "Water",
                    "right": "Wasser",
                },
                {
                    "left": "Bread",
                    "right": "Brot",
                },
                {
                    "left": "Milk",
                    "right": "Milch",
                },
            ]
        }),
        order_index=3,
    ),

    Exercise(
        lesson_id=lesson3.id,
        type="fill_blank",
        question="Ich trinke ___ .",
        correct_answer="Wasser",
        data=json.dumps({
            "options": [
                "Wasser",
                "Brot",
                "Käse",
                "Apfel",
            ]
        }),
        order_index=4,
    ),

    Exercise(
        lesson_id=lesson3.id,
        type="type_answer",
        question="Type the German word for 'cheese'.",
        correct_answer="Käse",
        data=json.dumps({}),
        order_index=5,
    ),
]

db.add_all(exercises3)


# --------------------------------------------------
# SKILL 4 — FAMILY
# --------------------------------------------------

skill4 = Skill(
    unit_id=unit2.id,
    title="Family",
    description="Learn common German family words.",
    order_index=2,
)

db.add(skill4)
db.flush()


lesson4 = Lesson(
    skill_id=skill4.id,
    title="Family Members",
    order_index=1,
)

db.add(lesson4)
db.flush()


exercises4 = [
    Exercise(
        lesson_id=lesson4.id,
        type="multiple_choice",
        question="How do you say 'mother' in German?",
        correct_answer="Mutter",
        data=json.dumps({
            "options": [
                "Mutter",
                "Vater",
                "Bruder",
                "Schwester",
            ]
        }),
        order_index=1,
    ),

    Exercise(
        lesson_id=lesson4.id,
        type="translate",
        question="Translate: father",
        correct_answer="Vater",
        data=json.dumps({
            "word_bank": [
                "Vater",
                "Mutter",
                "Bruder",
                "Schwester",
            ]
        }),
        order_index=2,
    ),

    Exercise(
        lesson_id=lesson4.id,
        type="match",
        question="Match the family members.",
        correct_answer="",
        data=json.dumps({
            "pairs": [
                {
                    "left": "Mother",
                    "right": "Mutter",
                },
                {
                    "left": "Father",
                    "right": "Vater",
                },
                {
                    "left": "Brother",
                    "right": "Bruder",
                },
            ]
        }),
        order_index=3,
    ),

    Exercise(
        lesson_id=lesson4.id,
        type="fill_blank",
        question="Meine ___ ist nett.",
        correct_answer="Mutter",
        data=json.dumps({
            "options": [
                "Mutter",
                "Vater",
                "Bruder",
                "Wasser",
            ]
        }),
        order_index=4,
    ),

    Exercise(
        lesson_id=lesson4.id,
        type="type_answer",
        question="Type the German word for 'sister'.",
        correct_answer="Schwester",
        data=json.dumps({}),
        order_index=5,
    ),
]

db.add_all(exercises4)


# --------------------------------------------------
# UNIT 3 — TRAVEL
# --------------------------------------------------

unit3 = Unit(
    course_id=course.id,
    title="Travel",
    description="Learn useful German words for travelling.",
    order_index=3,
)

db.add(unit3)
db.flush()


# --------------------------------------------------
# SKILL 5 — DIRECTIONS
# --------------------------------------------------

skill5 = Skill(
    unit_id=unit3.id,
    title="Directions",
    description="Learn how to ask for and give directions.",
    order_index=1,
)

db.add(skill5)
db.flush()


lesson5 = Lesson(
    skill_id=skill5.id,
    title="Finding Your Way",
    order_index=1,
)

db.add(lesson5)
db.flush()


exercises5 = [
    Exercise(
        lesson_id=lesson5.id,
        type="multiple_choice",
        question="How do you say 'Where?' in German?",
        correct_answer="Wo?",
        data=json.dumps({
            "options": [
                "Wo?",
                "Was?",
                "Wer?",
                "Wie?",
            ]
        }),
        order_index=1,
    ),

    Exercise(
        lesson_id=lesson5.id,
        type="translate",
        question="Translate: Where is the station?",
        correct_answer="Wo ist der Bahnhof?",
        data=json.dumps({
            "word_bank": [
                "Wo",
                "ist",
                "der",
                "Bahnhof?",
            ]
        }),
        order_index=2,
    ),

    Exercise(
        lesson_id=lesson5.id,
        type="match",
        question="Match the direction words.",
        correct_answer="",
        data=json.dumps({
            "pairs": [
                {
                    "left": "Left",
                    "right": "Links",
                },
                {
                    "left": "Right",
                    "right": "Rechts",
                },
                {
                    "left": "Straight",
                    "right": "Geradeaus",
                },
            ]
        }),
        order_index=3,
    ),

    Exercise(
        lesson_id=lesson5.id,
        type="fill_blank",
        question="Gehen Sie nach ___ .",
        correct_answer="links",
        data=json.dumps({
            "options": [
                "links",
                "Wasser",
                "Mutter",
                "Danke",
            ]
        }),
        order_index=4,
    ),

    Exercise(
        lesson_id=lesson5.id,
        type="type_answer",
        question="Type the German word for 'right'.",
        correct_answer="Rechts",
        data=json.dumps({}),
        order_index=5,
    ),
]

db.add_all(exercises5)


# --------------------------------------------------
# INITIAL USER PROGRESS
# --------------------------------------------------

db.commit()

for skill in [skill1, skill2, skill3, skill4, skill5]:
    progress = UserSkillProgress(
        user_id=user.id,
        skill_id=skill.id,
        completed=False,
        progress=60 if skill.id == skill1.id else 0,
        crowns=0,
    )
    db.add(progress)

db.commit()

print("German course seeded successfully!")
print("English → German")
print("Units: 3")
print("Skills: 5")
print("Lessons: 5")
print("Exercises: 25")

db.close()