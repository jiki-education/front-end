import Link from "next/link";

interface CTABlockProps {
  variant: "minimal" | "gradient";
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
}

export default function CTABlock({ variant, title, subtitle, buttonText, buttonHref }: CTABlockProps) {
  if (variant === "minimal") {
    return (
      <div className="max-w-[850px] mx-auto py-48 bg-white text-center border-t border-b border-gray-200 relative">
        <h2 className="text-36 font-semibold text-[#1a202c] mb-16 mt-0 leading-tight">{title}</h2>
        <p className="text-lg text-gray-500 mb-32 leading-relaxed max-w-[650px] mx-auto">{subtitle}</p>
        <Link
          href={buttonHref}
          className="inline-flex items-center gap-10 bg-white text-[#667eea] px-40 py-16 rounded-8 text-lg font-semibold no-underline transition-all shadow-[0_4px_12px_rgba(102,126,234,0.3)] hover:scale-[1.02] hover:shadow-[0_0_0_6px_rgba(102,126,234,0.15),_0_6px_20px_rgba(102,126,234,0.4)] group"
        >
          <span>{buttonText}</span>
          <span className="transition-transform group-hover:translate-x-4">→</span>
        </Link>
      </div>
    );
  }

  // Gradient variant
  return (
    <div className="max-w-[1400px] mx-auto my-60 mb-128 px-80">
      <div className="px-80 py-48 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-16 text-center">
        <h2 className="text-32 font-bold text-white mb-16 leading-tight">{title}</h2>
        <p className="text-lg text-purple-200 mb-24 leading-relaxed">{subtitle}</p>
        <Link
          href={buttonHref}
          className="inline-block bg-white text-[#667eea] px-40 py-16 rounded-8 text-lg font-semibold no-underline transition-all shadow-[0_4px_12px_rgba(102,126,234,0.3)] hover:scale-[1.02] hover:shadow-[0_0_0_6px_rgba(102,126,234,0.15),_0_6px_20px_rgba(102,126,234,0.4)]"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
