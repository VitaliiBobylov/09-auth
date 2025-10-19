import Image from "next/image";
import Link from "next/link";
import css from "./ProfilePage.module.css";
import { getMeServer } from "@/lib/api/serverApi";

export const metadata = {
  title: "Profile | NoteHub",
  description: "User profile page",
};

interface User {
  id: string;
  username?: string;
  email: string;
  avatar?: string;
}

export default async function ProfilePage() {
  const user: User | null = await getMeServer();

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>User not found. Please sign in again.</p>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/vercel.svg"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username || "Anonymous"}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
