const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || "Something went wrong"
    );
  }

  return data;
}


export async function getCourse(userId: number) {
  const response = await fetch(
    `${API_URL}/api/course?user_id=${userId}`,
    {
      cache: "no-store",
    }
  );

  return parseResponse(response);
}


export async function getLesson(
  lessonId: number
) {
  const response = await fetch(
    `${API_URL}/api/lessons/${lessonId}`,
    {
      cache: "no-store",
    }
  );

  return parseResponse(response);
}


export async function register(
  username: string
) {
  const response = await fetch(
    `${API_URL}/api/auth/register?username=${encodeURIComponent(username)}`,
    {
      method: "POST",
    }
  );

  return parseResponse(response);
}


export async function login(
  username: string
) {
  const response = await fetch(
    `${API_URL}/api/auth/login?username=${encodeURIComponent(username)}`,
    {
      method: "POST",
    }
  );

  return parseResponse(response);
}


export async function getUserStats(
  userId: number
) {
  const response = await fetch(
    `${API_URL}/api/user/stats?user_id=${userId}`,
    {
      cache: "no-store",
    }
  );

  return parseResponse(response);
}


export async function submitAnswer(
  lessonId: number,
  exerciseId: number,
  answer: string,
  userId: number
) {
  const response = await fetch(
    `${API_URL}/api/lessons/${lessonId}/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exercise_id: exerciseId,
        answer,
        user_id: userId,
      }),
    }
  );

  return parseResponse(response);
}


export async function completeLesson(
  lessonId: number,
  userId: number
) {
  const response = await fetch(
    `${API_URL}/api/lessons/${lessonId}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    }
  );

  return parseResponse(response);
}


export async function getLeaderboard() {
  const response = await fetch(
    `${API_URL}/api/leaderboard`,
    {
      cache: "no-store",
    }
  );

  return parseResponse(response);
}