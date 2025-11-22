import React from "react";

interface ConceptLayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export default function ConceptLayout({ children, rightPanel }: ConceptLayoutProps) {
  return (
    <div className="grid gap-32" style={{ gridTemplateColumns: "1fr 400px" }}>
      <main style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>{children}</main>
      <aside className="pt-0">{rightPanel || <div />}</aside>
    </div>
  );
}
