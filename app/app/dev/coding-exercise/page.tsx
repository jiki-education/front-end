import CodingExercise from "@/components/coding-exercise/CodingExercise";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev: Coding Exercise - Jiki",
  description: "Development page for testing the coding exercise component."
};

export default function CodingExerciseDevPage() {
  return (
    <CodingExercise
      exerciseSlug="scroll-and-shoot"
      language="jikiscript"
      context={{ type: "lesson", slug: "scroll-and-shoot" }}
    />
  );
}
