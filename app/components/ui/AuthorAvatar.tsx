import Image from "next/image";
import type { Author } from "@/lib/content/types";
import styles from "./AuthorAvatar.module.css";

interface AuthorAvatarProps {
  author: Author;
  size?: number;
}

export default function AuthorAvatar({ author, size = 20 }: AuthorAvatarProps) {
  return <Image src={author.avatar} alt={author.name} width={size} height={size} className={styles.avatar} />;
}
