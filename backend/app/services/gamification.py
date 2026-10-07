from datetime import datetime, timezone, timedelta

from ..models import User


def now_utc():
    return datetime.now(timezone.utc)


def add_daily_xp(user: User, amount: int):
    """
    Add XP to both total XP and today's XP.
    """
    today = now_utc().date().isoformat()

    if user.daily_xp_date != today:
        user.daily_xp = 0
        user.daily_xp_date = today

    user.daily_xp += amount
    user.xp += amount


def update_streak(user: User):
    """
    Update the user's daily streak when they complete a lesson.
    """

    today = now_utc().date()

    if not user.last_activity:
        user.streak = 1
        user.last_activity = today.isoformat()
        return

    try:
        last_date = datetime.fromisoformat(
            user.last_activity
        ).date()
    except ValueError:
        user.streak = 1
        user.last_activity = today.isoformat()
        return

    if last_date == today:
        # Already completed activity today.
        return

    yesterday = today - timedelta(days=1)

    if last_date == yesterday:
        user.streak += 1
    else:
        user.streak = 1

    user.last_activity = today.isoformat()


def refresh_daily_xp(user: User):
    """
    Reset daily XP when a new day starts.
    """
    today = now_utc().date().isoformat()

    if user.daily_xp_date != today:
        user.daily_xp = 0
        user.daily_xp_date = today