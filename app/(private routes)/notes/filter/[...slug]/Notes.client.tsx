"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useNotes } from "@/lib/api/clientApi";
import NoteList from "@/componentsts/NoteList/NoteList";
import Pagination from "@/componentsts/Pagination/Pagination";
import SearchBox from "@/componentsts/SearchBox/SearchBox";
import Link from "next/link";
import css from "./Notes.client.module.css";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError } = useNotes(debouncedSearch, page, tag);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load notes.</p>;

  const notes = data?.notes ?? [];
  const hasNotes = notes.length > 0;

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
          <NoteList notes={notes} />
          <Pagination
            currentPage={page}
            totalPages={data?.totalPages ?? 1}
            onPageChange={setPage}
          />
        </>
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
}
