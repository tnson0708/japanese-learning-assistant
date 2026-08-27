import { notFound } from "next/navigation";
import { SubtopicStudyView } from "@/components/vocabulary/subtopic-study-view";
import { getDomainById, getSubtopicById } from "@/data/vocabulary";

export default async function SubtopicPage({
  params,
}: {
  params: Promise<{ domainId: string; subtopicId: string }>;
}) {
  const { domainId, subtopicId } = await params;
  const domain = getDomainById(domainId);
  const subtopic = getSubtopicById(domainId, subtopicId);

  if (!domain || !subtopic) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8 print:max-w-none print:p-0 print:gap-4">
      <SubtopicStudyView domain={domain} subtopic={subtopic} />
    </div>
  );
}
