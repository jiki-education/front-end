interface ConceptsHeaderProps {
  isAuthenticated: boolean;
}

export default function ConceptsHeader({ isAuthenticated }: ConceptsHeaderProps) {
  const titleStyles = isAuthenticated
    ? "mb-4 text-5xl font-bold text-text-primary"
    : "mb-4 text-5xl font-bold text-gray-900";

  const descriptionStyles = isAuthenticated ? "text-lg text-text-secondary" : "text-lg text-gray-600";

  return (
    <header className="mb-12">
      <h1 className={titleStyles}>Concepts</h1>
      <p className={descriptionStyles}>Core programming concepts to master your coding skills</p>
      {!isAuthenticated && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">Sign up to track your progress and unlock personalized content!</p>
        </div>
      )}
    </header>
  );
}
