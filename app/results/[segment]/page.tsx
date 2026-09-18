import type { Metadata } from "next";
import { notFound } from "next/navigation";

import WhoIsThisForTemplate from "../../WhoIsThisForTemplate";
import { getWhoIsThisForSegment, whoIsThisForSegments } from "../../whoIsThisForData";

type PageProps = {
  params: Promise<{ segment: string }>;
};

export function generateStaticParams() {
  return whoIsThisForSegments.map((segment) => ({ segment: segment.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { segment: slug } = await params;
  const segment = getWhoIsThisForSegment(slug);

  if (!segment) {
    return {};
  }

  return {
    title: `${segment.label} — Who Is This For`,
    description: segment.description,
  };
}

export default async function WhoIsThisForSegmentPage({ params }: PageProps) {
  const { segment: slug } = await params;
  const segment = getWhoIsThisForSegment(slug);

  if (!segment) {
    notFound();
  }

  return <WhoIsThisForTemplate {...segment} />;
}
