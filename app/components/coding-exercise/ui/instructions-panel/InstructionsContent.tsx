import { marked } from "marked";

interface InstructionsContentProps {
  instructions: string;
  className?: string;
}

export default function InstructionsContent({ 
  instructions, 
  className = "" 
}: InstructionsContentProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div 
        className="prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ 
          __html: marked(instructions) 
        }}
      />
    </div>
  );
}