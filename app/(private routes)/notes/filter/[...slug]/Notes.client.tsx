"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Link from "next/link";
import css from "./Notes.client.module.css";

export default function NotesClient({ tag }: { tag?: string }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useNotes(debouncedSearch, page, tag);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load notes.</p>;

  const hasNotes = data?.notes && data.notes.length > 0;

  return (
    <div className={css.container}>
      <div className={css.searchAndButton}>
        <SearchBox value={search} onChange={setSearch} />
        <Link href="/notes/action/create" className={css.createButton}>
          + Create Note
        </Link>
      </div>

      {hasNotes ? (
        <>
          <NoteList notes={data!.notes} />
          <Pagination
            currentPage={page}
            totalPages={data!.totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
}
