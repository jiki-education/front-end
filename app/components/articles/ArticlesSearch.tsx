"use client";

interface ArticlesSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ArticlesSearch({ searchQuery, onSearchChange }: ArticlesSearchProps) {
  return (
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search articles..."
    />
  );
}
