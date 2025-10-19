import { ReactNode } from "react";
import css from "./LayoutNotes.module.css";

interface FilterLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div className={css.container}>
      {sidebar && <aside className={css.sidebar}>{sidebar}</aside>}
      <div className={css.notesWrapper}>{children}</div>
    </div>
  );
}
