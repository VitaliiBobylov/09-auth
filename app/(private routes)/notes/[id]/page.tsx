import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteByIdServer } from "@/lib/api/serverApi";
import getQueryClient from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const note = await fetchNoteByIdServer(id);

  const title = note?.title ? `NoteHub – ${note.title}` : "NoteHub – Нотатка";
  const description = note?.content
    ? note.content.slice(0, 150) + (note.content.length > 150 ? "..." : "")
    : "Перегляньте деталі цієї нотатки у NoteHub.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://09-auth-r6k6.vercel.app/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Note Details",
        },
      ],
      type: "website",
    },
  };
}

export default async function NoteModalPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
