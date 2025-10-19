"use client";

import { useRouter } from "next/navigation";
import { useNoteStore } from "@/lib/store/noteStore";
import { useCreateNote } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const { mutate, isPending, isError } = useCreateNote();

  const handleSubmit = (formData: FormData) => {
    const payload = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as Note["tag"],
    };

    mutate(payload, {
      onSuccess: () => {
        clearDraft();
        router.back();
      },
      onError: (err) => {
        console.error("Error creating note:", err);
      },
    });
  };

  return (
    <form
      className={css.form}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }}
    >
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={draft.title}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        className={css.input}
        required
        minLength={3}
        maxLength={50}
      />

      <textarea
        name="content"
        placeholder="Content"
        value={draft.content}
        onChange={(e) => setDraft({ ...draft, content: e.target.value })}
        className={css.textarea}
        maxLength={500}
      />

      <select
        name="tag"
        value={draft.tag}
        onChange={(e) =>
          setDraft({ ...draft, tag: e.target.value as Note["tag"] })
        }
        className={css.select}
      >
        {["Todo", "Work", "Personal", "Meeting", "Shopping"].map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <div className={css.actions}>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </button>
        <button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create note"}
        </button>
      </div>

      {isError && (
        <p className={css.error}>Failed to create note. Try again.</p>
      )}
    </form>
  );
}
