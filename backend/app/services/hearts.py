from datetime import datetime, timezone

HEART_REGEN_SECONDS = 5 * 60
MAX_HEARTS = 5


def refresh_hearts(user):
    """
    Regenerate hearts based on elapsed real time.

    Hearts regenerate even if the browser/app was closed because
    the calculation is based on the timestamp stored in SQLite.
    """
    if user.hearts >= MAX_HEARTS:
        user.hearts = MAX_HEARTS
        user.last_heart_loss = None
        return False

    if not user.last_heart_loss:
        return False

    try:
        last_time = datetime.fromisoformat(user.last_heart_loss)
    except (ValueError, TypeError):
        user.last_heart_loss = None
        return False

    now = datetime.now(timezone.utc)

    # Handle old timestamps that may not contain timezone info
    if last_time.tzinfo is None:
        last_time = last_time.replace(tzinfo=timezone.utc)

    elapsed = int((now - last_time).total_seconds())

    if elapsed < HEART_REGEN_SECONDS:
        return False

    recovered = elapsed // HEART_REGEN_SECONDS

    old_hearts = user.hearts
    user.hearts = min(MAX_HEARTS, user.hearts + recovered)

    if user.hearts >= MAX_HEARTS:
        user.last_heart_loss = None
    else:
        # Preserve leftover regeneration time.
        remaining_seconds = recovered * HEART_REGEN_SECONDS
        new_timestamp = last_time.timestamp() + remaining_seconds
        user.last_heart_loss = datetime.fromtimestamp(
            new_timestamp,
            timezone.utc
        ).isoformat()

    return user.hearts != old_hearts


def start_heart_regeneration(user):
    """
    Start/reset the regeneration timer after losing a heart.
    """
    if user.hearts < MAX_HEARTS:
        user.last_heart_loss = datetime.now(timezone.utc).isoformat()
    else:
        user.last_heart_loss = None