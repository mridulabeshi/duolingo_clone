import LessonPlayer from "@/components/LessonPlayer";
import { getLesson } from "@/lib/api";

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LessonPage({
  params,
}: LessonPageProps) {
  const { id } = await params;

  const lesson = await getLesson(Number(id));

  return <LessonPlayer lesson={lesson} />;
}